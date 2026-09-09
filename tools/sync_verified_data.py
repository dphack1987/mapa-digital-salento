#!/usr/bin/env python3
"""Sincroniza places.json y mapMarkers.json con fichas verificadas de /public/pautas.
Solo corrige y enriquece. No borra places existentes."""
from __future__ import annotations
import json
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"

def U(p: str) -> str:
    return quote(p, safe="/:%") if not p.startswith("http") else p

def main() -> None:
    places_path = PUB / "data/places.json"
    markers_path = PUB / "data/mapMarkers.json"
    data = json.loads(places_path.read_text(encoding="utf-8"))
    places = data["places"]
    by_id = {p["id"]: p for p in places}

    # 1. MOTO AVENTURA 110 (ID19): de transporte genérico a experiencia verificada minimotocross
    m = by_id[19]
    m["type"] = "Experiencias"
    m["description"] = ("Pista de minimotocross en Salento para niños y adultos. Minimotos 110 cc semiautomáticas "
                        "(también en modo automático). Turnos de 10, 15 y 20 minutos con casco, protecciones y póliza incluidos.")
    m["timeInfo"] = "10 min $15.000 · 15 min $20.000 · 20 min $25.000"
    m["badge"] = "Aventura"
    m.pop("transportDetails", None)
    m["experienceDetails"] = {
        "duration": "10, 15 o 20 minutos por turno",
        "difficulty": "Fácil",
        "groupSize": "Individual por moto",
        "included": ["Casco", "Protecciones", "Póliza de seguro"],
        "notIncluded": ["Transporte a la pista", "Comida", "Bebidas"],
        "requirements": ["Estatura mínima 130 cm", "Saber manejar bicicleta", "Pantalón largo", "Zapato cerrado", "Ropa cómoda"],
        "languages": ["Español"],
        "meetingPoint": "Pista Moto Aventura 110, Salento (confirmar ubicación por WhatsApp)",
        "cancellationPolicy": "Confirmar directamente con el operador",
        "tariff": "10 min: $15.000 · 15 min: $20.000 · 20 min: $25.000",
    }
    m["location"] = {"lat": 4.631, "lng": -75.5735, "address": "Salento, Quindío",
                     "landmark": "Pista en Salento (confirmar ubicación por WhatsApp)"}
    m["operatingHours"] = {"notes": "Horario por confirmar. Reserva previa por WhatsApp"}
    m["tags"] = ["moto", "minimotocross", "aventura", "adrenalina", "pista", "familia", "niños"]

    # 2. HOTEL LA FLORESTA (ID16): dirección, check-in, precio y servicios verificados
    f = by_id[16]
    f["location"] = {"lat": f["location"].get("lat", 4.6371), "lng": f["location"].get("lng", -75.5706),
                     "address": "Cra. 5 #10-11, Barrio La Floresta",
                     "landmark": "A 400 m de la plaza principal (10 min a pie)"}
    acc = f.setdefault("accommodationDetails", {})
    acc["checkIn"] = "15:00"
    acc["checkOut"] = "12:00"
    acc["stars"] = 3
    acc["categoryLabel"] = acc.get("categoryLabel", "Hotel boutique rural 3 estrellas")
    acc["bookingNotes"] = "Desde $124.000 COP/noche según web oficial. Confirmar tarifa y disponibilidad por WhatsApp."
    for key, vals in {
        "roomTypes": ["Estándar", "Doble", "Triple", "Cuádruple", "Familiar", "Suite con jacuzzi"],
        "services": ["Coffee Spa", "Gimnasio", "Coworking", "Desayuno 7:00-10:00", "Parqueadero", "Recepción 24 horas", "Información turística"],
        "amenities": ["Wi-Fi alta velocidad", "Café gratuito", "Zona de hamacas", "Talleres de cocina", "Avistamiento de aves", "Mascotas permitidas"],
    }.items():
        cur = acc.get(key, [])
        acc[key] = cur + [v for v in vals if v not in cur]
    if "Tarifas desde $124.000 COP por noche." not in f["description"]:
        f["description"] = f["description"].rstrip() + " Tarifas desde $124.000 COP por noche."

    # 3. BOKI MALL (ID13): RNT verificado
    b = by_id[13]
    if "91079" not in b["description"]:
        b["description"] = b["description"].rstrip() + " Registro Nacional de Turismo #91079."

    # 4. FONDA BOQUÍA (nuevo ID32): carta verificada con precios
    if 32 not in by_id:
        fonda = {
            "id": 32,
            "name": "Restaurante Bar Fonda Boquía",
            "type": "Restaurantes",
            "description": ("Restaurante y bar en Boquía con carta verificada: truchas en 11 preparaciones ($28.000-$46.000), "
                            "carnes, adicionales y desayunos. Ambiente local para turistas de paso. Pedido directo por WhatsApp, sin intermediarios."),
            "priceRange": "$$",
            "rating": "4.5",
            "timeInfo": "Carta con precios verificados",
            "badge": "Carta verificada",
            "color": "coral",
            "icon": "Utensils",
            "contact": {"phone": "+57 313 7160977", "whatsapp": "573137160977"},
            "location": {"lat": 4.641, "lng": -75.559, "address": "Boquía, Salento",
                         "landmark": "Zona de Boquía"},
            "operatingHours": {"notes": "Horario por confirmar con el restaurante"},
            "tags": ["restaurante", "bar", "trucha", "boquía", "carta", "gastronomía", "mojarra"],
            "verified": True,
            "active": True,
            "foodServiceDetails": {
                "cuisineType": ["Colombiana", "Trucha", "Comida local"],
                "specialties": ["Trucha frita", "Trucha a la plancha", "Trucha al ajillo", "Trucha gratinada", "Trucha marinera", "Mojarra"],
                "menuHighlights": [
                    "Trucha frita $28.000", "Trucha a la plancha $28.000", "Trucha finas hierbas $30.000",
                    "Trucha al ajillo $32.000", "Trucha hawaiana $30.000", "Trucha criolla $30.000",
                    "Trucha con champiñones $36.000", "Trucha gratinada $36.000", "Trucha al ajillo más champiñones $40.000",
                    "Trucha mixta $46.000", "Trucha marinera $45.000", "Mojarra $38.000",
                    "Carne de res $45.000", "Filete de pollo $35.000", "Lomo de cerdo $36.000",
                    "Patacón $8.000", "Empanada $3.000", "Crema de trucha $10.000", "Salchipapa $18.000",
                    "Huevos al gusto $14.000", "Jugo natural en agua $8.000", "Jugo natural en leche $10.000", "Limonada de coco $12.000",
                ],
                "averagePrice": "Truchas $28.000-$46.000 · Carnes $35.000-$45.000",
                "reservationRequired": False,
            },
            "photos": [
                U("/pautas/restaurante_bar_fonda_boquia/menu-carta1.jpeg"),
                U("/pautas/restaurante_bar_fonda_boquia/menu-carta2.jpeg"),
                U("/pautas/restaurante_bar_fonda_boquia/29389126_1005353112946875_6049563033867386880_n.jpg"),
            ],
        }
        places.append(fonda)
        print("Fonda Boquía añadida como ID32")
    else:
        print("ID32 ya existe, no se duplica")

    places_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # 5. Marker Fonda
    mk = json.loads(markers_path.read_text(encoding="utf-8"))
    key = "markers" if "markers" in mk else "mapMarkers"
    arr = mk[key]
    if not any(x.get("placeId") == 32 for x in arr):
        arr.append({"id": 32, "label": "Restaurante Bar Fonda Boquía", "type": "Gastronómico",
                    "placeId": 32, "coord": [4.641, -75.559], "tone": "coral",
                    "note": "Carta verificada con precios"})
        markers_path.write_text(json.dumps(mk, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("Marker 32 añadido")
    else:
        print("Marker 32 ya existe")

    print("Sincronización verificada OK: moto=Experiencias, floresta=precios/dirección, boki=RNT, fonda=ID32")

if __name__ == "__main__":
    main()
