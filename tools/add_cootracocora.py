#!/usr/bin/env python3
"""Crea ficha verificada Cootracocora LTDA (ID114) + marker. No toca el resto."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"

def main() -> None:
    pp = PUB / "data/places.json"
    data = json.loads(pp.read_text(encoding="utf-8"))
    if any(p["id"] == 114 for p in data["places"]):
        print("ID114 ya existe, no se duplica")
    else:
        data["places"].append({
            "id": 114,
            "name": "Cootracocora LTDA",
            "type": "Servicios",
            "description": ("Cootracocora LTDA – Cooperativa de Transportadores del Valle de Cocora. "
                            "Empresa de transporte público del municipio de Salento. Jeeps Willys tradicionales "
                            "Salento – Valle de Cocora con salidas diarias 6:00 AM – 9:00 PM desde la plaza principal. "
                            "Coordinación directa por WhatsApp, sin intermediarios."),
            "priceRange": "$",
            "rating": "Nuevo",
            "timeInfo": "Salidas diarias 6:00 AM – 9:00 PM",
            "badge": "Transporte oficial",
            "color": "yellow",
            "icon": "Bike",
            "contact": {
                "phone": "+57 310 4372944",
                "whatsapp": "573104372944",
                "email": "cootracocoraltda@hotmail.com",
            },
            "location": {"lat": 4.6385, "lng": -75.5642,
                         "address": "Plaza de Bolívar, Salento, Quindío",
                         "landmark": "Terminal de Transporte Público Jeep Willys"},
            "operatingHours": {"notes": "Lunes a domingo 6:00 AM – 9:00 PM. Salidas al completar cupo."},
            "tags": ["transporte", "jeep", "willys", "cocora", "cootracocora", "cooperativa", "plaza", "valle"],
            "verified": True,
            "active": True,
            "transportDetails": {
                "transportType": "Jeep Willys",
                "routes": ["Salento – Valle de Cocora", "Valle de Cocora – Salento"],
                "languages": ["Español"],
                "capacity": "Salidas al completar cupo",
                "meetingPoint": "Plaza principal de Salento – Terminal de Transporte Público Jeep Willys",
                "pricingNotes": "Tarifa de referencia desde $3.600 COP por trayecto. Confirmar tarifa vigente por WhatsApp.",
                "tariff": "Desde $3.600 COP por trayecto (confirmar)",
                "included": ["Transporte compartido en Jeep Willys"],
                "notIncluded": ["Entradas a senderos", "Guía", "Alimentación"],
                "operatingDays": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
                "advanceBookingRequired": False,
            },
            "photos": [],
        })
        pp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("ID114 Cootracocora LTDA creado")

    mp = PUB / "data/mapMarkers.json"
    mk = json.loads(mp.read_text(encoding="utf-8"))
    key = "markers" if "markers" in mk else "mapMarkers"
    arr = mk[key]
    if not any(x.get("placeId") == 114 for x in arr):
        nid = max([x.get("id", 0) for x in arr] + [0]) + 1
        arr.append({"id": nid, "label": "Cootracocora LTDA", "type": "Comercial",
                    "placeId": 114, "coord": [4.6385, -75.5642], "tone": "primary",
                    "note": "Jeeps Willys Salento – Cocora"})
        mp.write_text(json.dumps(mk, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"Marker {nid} añadido")
    else:
        print("Marker 114 ya existe")

if __name__ == "__main__":
    main()
