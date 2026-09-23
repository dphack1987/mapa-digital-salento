from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Tuple
from datetime import date
from math import cos, radians, sqrt
import json
import os
import re

app = FastAPI(title="Salento AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = None

# Intención de chat -> keywords contra type/name/tags reales de places.json
CATEGORY_KEYWORDS: Dict[str, List[str]] = {
    'accommodation': ['alojamiento', 'alojamientos', 'hotel', 'hostal', 'camping', 'dormir', 'habitacion'],
    'food': ['restaurante', 'restaurantes', 'restaurante bar', 'gastronomia', 'comida', 'fonda', 'trucha', 'bar'],
    'transport': ['servicio', 'servicios', 'transporte', 'jeep', 'willys', 'terminal', 'movilidad'],
    'coffee': ['coffee tour', 'coffee tours', 'cafe', 'cafetera', 'finca'],
    'nature': ['atractivo', 'atractivos', 'sendero', 'cascada', 'mirador', 'naturaleza', 'valle', 'cocora', 'experiencia'],
    'events': ['evento', 'eventos', 'feria'],
    'shopping': ['artesania', 'artesanias', 'tienda', 'tiendas'],
    'all': [],
}

# place.type (datos reales) -> clave de categoría
TYPE_TO_CATEGORY: Dict[str, str] = {
    'alojamientos': 'accommodation',
    'camping': 'accommodation',
    'restaurantes': 'food',
    'restaurante bar': 'food',
    'cafés': 'food',
    'cafes': 'food',
    'coffee tours': 'coffee',
    'servicios': 'transport',
    'atractivos turísticos': 'nature',
    'atractivos turisticos': 'nature',
    'experiencias': 'nature',
    'eventos': 'events',
    'artesanías': 'shopping',
    'artesanias': 'shopping',
    'tiendas': 'shopping',
}

ALIAS_TO_CATEGORY: Dict[str, str] = {
    'hotel': 'accommodation',
    'hoteles': 'accommodation',
    'alojamiento': 'accommodation',
    'alojamientos': 'accommodation',
    'camping': 'accommodation',
    'restaurante': 'food',
    'restaurantes': 'food',
    'comida': 'food',
    'gastronomia': 'food',
    'transporte': 'transport',
    'jeep': 'transport',
    'willys': 'transport',
    'cafe': 'coffee',
    'coffee': 'coffee',
    'coffee tours': 'coffee',
    'nature': 'nature',
    'naturaleza': 'nature',
    'sendero': 'nature',
    'evento': 'events',
    'eventos': 'events',
    'artesanias': 'shopping',
    'tiendas': 'shopping',
}


def load_pautantes_data() -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    try:
        project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        places_path = os.path.join(project_root, '..', 'public', 'data', 'places.json')
        hotels_path = os.path.join(project_root, '..', 'public', 'data', 'hotels.json')

        places_data: List[Dict[str, Any]] = []
        hotels_data: List[Dict[str, Any]] = []

        if os.path.exists(places_path):
            with open(places_path, 'r', encoding='utf-8') as f:
                places_data = json.load(f).get('places', [])

        if os.path.exists(hotels_path):
            with open(hotels_path, 'r', encoding='utf-8') as f:
                hotels_data = json.load(f).get('hotels', [])

        return places_data, hotels_data
    except Exception as e:
        print(f"Error cargando datos de pautantes: {e}")
        return [], []


PLACES_DATA, HOTELS_DATA = load_pautantes_data()


def normalize_category(category: Optional[str]) -> str:
    if not category:
        return 'all'
    key = category.strip().lower()
    if key in ALIAS_TO_CATEGORY:
        return ALIAS_TO_CATEGORY[key]
    if key in TYPE_TO_CATEGORY:
        return TYPE_TO_CATEGORY[key]
    if key in CATEGORY_KEYWORDS:
        return key
    return 'all'


def place_haystack(place: Dict[str, Any]) -> str:
    parts = [
        str(place.get('type') or ''),
        str(place.get('name') or ''),
        ' '.join(str(t) for t in (place.get('tags') or [])),
        str(place.get('description') or ''),
    ]
    return ' '.join(parts).lower()


def place_matches_category(place: Dict[str, Any], category: str) -> bool:
    if category in ('', 'all'):
        return True
    keywords = CATEGORY_KEYWORDS.get(category, [])
    if not keywords:
        type_key = (place.get('type') or '').lower()
        return TYPE_TO_CATEGORY.get(type_key, '') == category
    haystack = place_haystack(place)
    if any(k in haystack for k in keywords):
        return True
    type_key = (place.get('type') or '').lower()
    return TYPE_TO_CATEGORY.get(type_key, '') == category


def short_description(place: Dict[str, Any]) -> str:
    desc = place.get('description') or ''
    if not isinstance(desc, str):
        desc = str(desc)
    if len(desc) > 100:
        return desc[:100] + '...'
    return desc


def place_to_pautante(place: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': place.get('id'),
        'name': place.get('name', ''),
        'type': place.get('type', ''),
        'description': short_description(place),
        'contact': place.get('contact') or {},
        'is_partner': bool(place.get('isPautante') or place.get('verified')),
        'rating': place.get('rating'),
        'distance_km': place.get('distance_km'),
    }


def hotel_to_pautante(hotel: Dict[str, Any]) -> Dict[str, Any]:
    phone = hotel.get('phone') or ''
    whatsapp = re.sub(r'\D', '', phone)
    if whatsapp.startswith('57') and len(whatsapp) == 12:
        wa = whatsapp
    elif whatsapp.startswith('0'):
        wa = '57' + whatsapp[1:]
    elif len(whatsapp) == 10:
        wa = '57' + whatsapp
    else:
        wa = whatsapp
    return {
        'id': hotel.get('placeId') or hotel.get('id'),
        'name': hotel.get('name', ''),
        'type': 'Alojamientos',
        'description': f"Hotel partner en {hotel.get('address', 'Salento')}",
        'contact': {'phone': phone, 'whatsapp': wa},
        'is_partner': bool(hotel.get('isPartner')),
        'rating': None,
    }


def find_pautante(pautante_id: int) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    for place in PLACES_DATA:
        if place.get('id') == pautante_id:
            return place, 'place'
    for hotel in HOTELS_DATA:
        if hotel.get('placeId') == pautante_id or hotel.get('id') == pautante_id:
            return hotel, 'hotel'
    return None, None


def get_pautantes_by_category(category: str) -> List[Dict[str, Any]]:
    category = normalize_category(category)
    matching: List[Dict[str, Any]] = []

    for place in PLACES_DATA:
        if place_matches_category(place, category):
            matching.append(place_to_pautante(place))

    if category in ('accommodation', 'all'):
        for hotel in HOTELS_DATA:
            if hotel.get('isPartner', False):
                matching.append(hotel_to_pautante(hotel))

    return matching[:5]


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    # Aproximación local suficiente para Salento (~10 km)
    mean_lat = radians((lat1 + lat2) / 2.0)
    dlat = (lat1 - lat2) * 111.32
    dlng = (lng1 - lng2) * 111.32 * cos(mean_lat)
    return sqrt(dlat * dlat + dlng * dlng)


def parse_rating(value: Any, default: int = 70) -> int:
    try:
        return int(float(value) * 20)
    except (TypeError, ValueError):
        return default


@app.get("/")
async def root():
    return {"status": "online", "message": "Backend Python funcionando con integracion de pautantes"}


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "backend": "python",
        "pautantes_loaded": len(PLACES_DATA) + len(HOTELS_DATA),
    }


@app.post("/api/v1/chat/message")
async def process_message(message: ChatMessage):
    text_lower = (message.message or '').lower()

    intent = "general"
    if any(k in text_lower for k in ("hotel", "dormir", "alojamiento", "habitacion", "hostal", "camping")):
        intent = "accommodation"
    elif any(k in text_lower for k in ("comer", "restaurante", "hambre", "almorzar", "trucha", "comida")):
        intent = "food"
    elif any(k in text_lower for k in ("llegar", "transporte", "jeep", "willys", "como ir", "terminal")):
        intent = "transport"
    elif any(k in text_lower for k in ("cafe", "coffee", "tour de cafe", "finca")):
        intent = "coffee"
    elif any(k in text_lower for k in ("sendero", "cascada", "mirador", "cocora", "valle", "naturaleza")):
        intent = "nature"
    elif any(k in text_lower for k in ("evento", "feria", "agenda")):
        intent = "events"
    elif any(k in text_lower for k in ("artesan", "tienda", "comprar")):
        intent = "shopping"

    pautantes = get_pautantes_by_category(intent)

    if pautantes:
        intro = {
            "accommodation": "Para eso te recomiendo estos lugares:",
            "food": "Puedes ir a estos restaurantes:",
            "transport": "Te recomiendo estos servicios:",
            "coffee": "Estos lugares tienen buena experiencia de cafe:",
            "nature": "Estos planes encajan contigo:",
            "events": "Agenda local:",
            "shopping": "Opciones para comprar:",
            "general": "Te puede servir:",
        }
        response_text = intro.get(intent, intro["general"])
    else:
        responses = {
            "accommodation": "Que tipo de alojamiento prefieres? Hay desde economicos hasta de lujo.",
            "food": "Que te apetece comer? Hay desde comida tradicional hasta platos especiales.",
            "transport": "Desde donde vienes? Puedo ayudarte a encontrar la mejor opcion.",
            "coffee": "Prefieres algo cerca del pueblo o en el campo? Hay opciones para ambos.",
            "general": "Hola! Soy Don Chucho. En que te puedo ayudar con tu viaje a Salento?",
        }
        response_text = responses.get(intent, responses["general"])

    return {
        "response": response_text,
        "intent": intent,
        "confidence": 0.8 if pautantes else 0.6,
        "suggestions": ["hoteles", "restaurantes", "transporte", "cafe"],
        "pautantes": pautantes,
        "has_pautantes": len(pautantes) > 0,
        "whatsapp_direct": True,
    }


@app.get("/api/v1/pautantes/whatsapp-direct")
async def whatsapp_direct(pautante_id: int = Query(..., description="ID del pautante")):
    """WhatsApp One-Tap - acceso directo sin formulario"""
    pautante, kind = find_pautante(pautante_id)
    if not pautante:
        return {"success": False, "error": "Pautante no encontrado"}

    whatsapp = None
    if kind == 'place':
        whatsapp = (pautante.get('contact') or {}).get('whatsapp')
    else:
        phone = pautante.get('phone') or ''
        digits = re.sub(r'\D', '', phone)
        if digits:
            if digits.startswith('57') and len(digits) == 12:
                whatsapp = digits
            elif len(digits) == 10:
                whatsapp = '57' + digits
            elif digits.startswith('0'):
                whatsapp = '57' + digits[1:]
            else:
                whatsapp = digits

    if not whatsapp:
        return {"success": False, "error": "Este pautante no tiene WhatsApp publicado"}

    return {
        "success": True,
        "whatsapp_url": f"https://wa.me/{whatsapp}",
        "pautante_name": pautante.get('name'),
        "message": "Hola! Vi su informacion en Salento a la Mano. Me interesa su servicio.",
    }


@app.post("/api/v1/pautantes/availability")
async def check_availability(pautante_id: int):
    pautante, kind = find_pautante(pautante_id)
    if not pautante:
        return {"success": False, "error": "Pautante no encontrado"}

    if kind == 'hotel':
        is_available = bool(pautante.get('isPartner', False))
        source = "partner_hotel_data"
    else:
        is_available = bool(pautante.get('active', True)) and bool(pautante.get('verified', False))
        source = "verified_local_data"

    return {
        "success": True,
        "pautante_id": pautante_id,
        "pautante_name": pautante.get('name'),
        "is_available": is_available,
        "last_checked": date.today().isoformat(),
        "message": "Disponible para reserva" if is_available else "Temporalmente no disponible",
        "source": source,
    }


@app.post("/api/v1/pautantes/quality-verification")
async def quality_verification(pautante_id: int):
    pautante, kind = find_pautante(pautante_id)
    if not pautante:
        return {"success": False, "error": "Pautante no encontrado"}

    if kind == 'hotel':
        quality_score = 80 if pautante.get('isPartner') else 60
        rating_str = '0'
        is_verified = bool(pautante.get('isPartner'))
        is_active = True
    else:
        rating_str = pautante.get('rating', '0')
        quality_score = parse_rating(rating_str, 70)
        is_verified = bool(pautante.get('verified', False))
        is_active = bool(pautante.get('active', True))

    return {
        "success": True,
        "pautante_id": pautante_id,
        "pautante_name": pautante.get('name'),
        "quality_score": quality_score,
        "rating_original": rating_str,
        "verification_method": "verified_local_data",
        "verified_by": "Salento a la Mano Team",
        "verification_date": date.today().isoformat(),
        "criteria": {
            "service_quality": "verified" if is_verified else "pending",
            "authenticity": "verified" if is_verified else "pending",
            "local_reputation": "verified" if is_active else "pending",
            "safety_standards": "verified" if is_verified else "pending",
        },
        "source": "verified_local_data",
    }


@app.post("/api/v1/pautantes/tourist-trap-filter")
async def tourist_trap_filter(category: str = Query(..., description="Categoría o place.type")):
    """Filtro de turistazas - acepta place.type o claves de intención"""
    normalized = normalize_category(category)

    authentic_places = []
    for place in PLACES_DATA:
        if not place_matches_category(place, normalized):
            continue
        is_verified = bool(place.get('verified', False))
        is_active = bool(place.get('active', True))
        if not (is_verified and is_active):
            continue
        rating = place.get('rating', '0')
        authentic_places.append({
            'id': place.get('id'),
            'name': place.get('name'),
            'type': place.get('type'),
            'authenticity_score': parse_rating(rating, 80),
            'local_approval': 'verified',
            'rating': rating,
            'verified': True,
        })

    matched_in_category = sum(1 for p in PLACES_DATA if place_matches_category(p, normalized))
    return {
        "category": category,
        "normalized": normalized,
        "authentic_places": authentic_places[:5],
        "tourist_traps_filtered": max(0, matched_in_category - len(authentic_places)),
        "filter_criteria": "verified_local_data + active_status",
        "source": "verified_local_data",
    }


@app.get("/api/v1/pautantes/nearby")
async def get_nearby_pautantes(
    lat: float = Query(..., description="Latitud"),
    lng: float = Query(..., description="Longitud"),
    category: str = Query("all", description="Categoría o place.type"),
    radius: float = Query(5.0, description="Radio en km"),
):
    """GPS Proximity - pautantes cercanos (radio real en kilómetros)"""
    normalized = normalize_category(category)
    nearby_pautantes: List[Dict[str, Any]] = []

    for place in PLACES_DATA:
        place_lat = place.get('location', {}).get('lat')
        place_lng = place.get('location', {}).get('lng')
        if place_lat is None or place_lng is None:
            continue
        if not place_matches_category(place, normalized):
            continue
        distance_km = haversine_km(float(lat), float(lng), float(place_lat), float(place_lng))
        if distance_km <= float(radius):
            entry = place_to_pautante(place)
            entry['distance_km'] = round(distance_km, 2)
            nearby_pautantes.append(entry)

    nearby_pautantes.sort(key=lambda x: x.get('distance_km', float('inf')))

    return {
        "nearby_pautantes": nearby_pautantes[:5],
        "user_location": {"lat": lat, "lng": lng},
        "radius_km": radius,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
