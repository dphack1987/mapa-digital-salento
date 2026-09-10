#!/usr/bin/env python3
"""Sincroniza Tía Emiss (nuevo), Don Elías finca+restaurante. No borra nada."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"

def main() -> None:
    pp = PUB / "data/places.json"
    data = json.loads(pp.read_text(encoding="utf-8"))
    by_id = {p["id"]: p for p in data["places"]}

    # 1. TÍA EMISS nuevo ID115
    if not any(p["id"] == 115 for p in data["places"]):
        data["places"].append({
            "id": 115,
            "name": "Hotel La Tía Emiss",
            "type": "Alojamientos",
            "description": ("Hotel familiar de arquitectura de colonización antioqueña a dos cuadras del parque "
                            "de Salento. Habitaciones dobles, twin, triples y dúplex familiar con Wi-Fi gratis. "
                            "Contacto directo por WhatsApp, sin intermediarios."),
            "priceRange": "$$",
            "rating": "4.4",
            "timeInfo": "Reserva directa",
            "badge": "Familiar",
            "color": "green",
            "icon": "Hotel",
            "contact": {"phone": "+57 316 4162726", "whatsapp": "573164162726",
                        "email": "tiaemiss@gmail.com",
                        "facebook": "https://www.facebook.com/latiaemiss"},
            "location": {"lat": 4.6375, "lng": -75.5715,
                         "address": "Carrera 4 #5-38",
                         "landmark": "A dos cuadras del parque principal"},
            "operatingHours": {"notes": "Horarios de recepción por confirmar con el hotel"},
            "tags": ["hotel", "tia emis", "familiar", "centro", "wifi", "alojamiento"],
            "verified": True,
            "active": True,
            "accommodationDetails": {
                "categoryLabel": "Hotel urbano familiar 2 estrellas",
                "roomTypes": ["Doble matrimonial (2 pax)", "Twin (4 pax)", "Triple (6 pax)", "Dúplex familiar (8 pax)"],
                "services": ["Wi-Fi gratis"],
                "roomFeatures": ["TV", "Baño privado"],
                "nearby": ["Parque principal", "Calle Real", "Bares y restaurantes"],
                "policies": ["Tarifas y condiciones por confirmar directo"],
                "checkIn": "Por confirmar",
                "checkOut": "Por confirmar",
                "amenities": ["Wi-Fi gratis"],
                "bookingNotes": "Tarifas por confirmar directamente por WhatsApp.",
            },
            "photos": [],
        })
        print("ID115 Hotel La Tía Emiss creado")

    # 2. DON ELÍAS FINCA ID17: contacto oficial + hechos públicos
    d = by_id[17]
    d["contact"] = {"phone": "+57 315 606 1113", "whatsapp": "573156061113",
                    "email": "fincafeteradonelias@gmail.com",
                    "website": "https://fincafeteradonelias.com.co"}
    d["location"] = {"lat": d["location"].get("lat", 4.63), "lng": d["location"].get("lng", -75.575),
                     "address": "Vereda Palestina Km 4",
                     "landmark": "Vía rural de Salento"}
    d["operatingHours"] = {"notes": "Contacto Lun–Vie 9am–5pm. Tour ~2 horas, confirmar horarios."}
    if "orgánico" not in d["description"]:
        d["description"] = (d["description"].rstrip() + " Café 100% orgánico en la vereda Palestina Km 4. "
                            "Tour de ~2 horas con guías en español, inglés y francés.")
    d["tags"] = sorted(set(d.get("tags", []) + ["organico", "bilingue", "palestina"]))
    print("ID17 Don Elías finca sincronizado")

    # 3. RESTAURANTE DON ELÍAS ID22: vínculo con finca (contacto sigue pendiente)
    r = by_id[22]
    if "Finca Don Elías" not in r["description"]:
        r["description"] = (r["description"].rstrip() + " Ubicado en la Finca Don Elías. "
                            "Contacto directo en verificación.")
    print("ID22 descripción vinculada")

    pp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # 4. Marker Tía Emiss
    mp = PUB / "data/mapMarkers.json"
    mk = json.loads(mp.read_text(encoding="utf-8"))
    key = "markers" if "markers" in mk else "mapMarkers"
    arr = mk[key]
    if not any(x.get("placeId") == 115 for x in arr):
        nid = max([x.get("id", 0) for x in arr] + [0]) + 1
        arr.append({"id": nid, "label": "Hotel La Tía Emiss", "type": "Comercial",
                    "placeId": 115, "coord": [4.6375, -75.5715], "tone": "primary",
                    "note": "Hotel familiar cerca del parque"})
        mp.write_text(json.dumps(mk, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Marker {nid} añadido")

if __name__ == "__main__":
    main()
