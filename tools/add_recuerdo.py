#!/usr/bin/env python3
"""Crea ficha verificada El Recuerdo Coffee Tour (ID116) + marker. No toca el resto."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"

def main() -> None:
    pp = PUB / "data/places.json"
    data = json.loads(pp.read_text(encoding="utf-8"))
    if not any(p["id"] == 116 for p in data["places"]):
        data["places"].append({
            "id": 116,
            "name": "El Recuerdo Coffee Tour",
            "type": "Coffee Tours",
            "description": ("Tienda de café y finca en medio de la naturaleza en donde se respira café. "
                            "Coffee tour con reserva directa por WhatsApp, sin intermediarios."),
            "priceRange": "$$",
            "rating": "Nuevo",
            "timeInfo": "Reserva directa",
            "badge": "Café de origen",
            "color": "green",
            "icon": "Coffee",
            "contact": {"phone": "+57 310 3764672", "whatsapp": "573103764672",
                        "email": "cazal16@yahoo.es"},
            "location": {"lat": 4.6371, "lng": -75.5706,
                         "address": "Zona rural, Salento",
                         "landmark": "Finca rural (confirmar ubicación por WhatsApp)"},
            "operatingHours": {"notes": "Horarios y duración por confirmar con la finca"},
            "tags": ["coffee tour", "café", "finca", "recuerdo", "naturaleza", "reserva"],
            "verified": True,
            "active": True,
            "experienceDetails": {
                "duration": "Por confirmar",
                "difficulty": "Fácil",
                "groupSize": "Por confirmar",
                "included": ["Recorrido cafetero"],
                "notIncluded": ["Transporte"],
                "requirements": ["Reserva previa por WhatsApp"],
                "languages": ["Español"],
                "meetingPoint": "Por confirmar con la finca",
                "cancellationPolicy": "Confirmar directamente con el operador",
            },
            "photos": [],
        })
        pp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("ID116 El Recuerdo Coffee Tour creado")

    mp = PUB / "data/mapMarkers.json"
    mk = json.loads(mp.read_text(encoding="utf-8"))
    key = "markers" if "markers" in mk else "mapMarkers"
    arr = mk[key]
    if not any(x.get("placeId") == 116 for x in arr):
        nid = max([x.get("id", 0) for x in arr] + [0]) + 1
        arr.append({"id": nid, "label": "El Recuerdo Coffee Tour", "type": "Turístico",
                    "placeId": 116, "coord": [4.6371, -75.5706], "tone": "primary",
                    "note": "Coffee tour con reserva directa"})
        mp.write_text(json.dumps(mk, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Marker {nid} añadido")

if __name__ == "__main__":
    main()
