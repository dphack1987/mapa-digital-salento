#!/usr/bin/env python3
"""Fusiona datos verificados en Fonda Boquía ID21 y elimina duplicado ID32 propio.
Solo corrige un duplicado creado en esta sesión."""
from __future__ import annotations
import json
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"

def U(p: str) -> str:
    return quote(p, safe="/:%") if not p.startswith("http") else p

def main() -> None:
    pp = PUB / "data/places.json"
    data = json.loads(pp.read_text(encoding="utf-8"))
    places = data["places"]
    by_id = {p["id"]: p for p in places}
    f = by_id[21]
    f["contact"] = {"phone": "+57 313 7160977", "whatsapp": "573137160977"}
    if "carta verificada" not in f["description"]:
        f["description"] = (f["description"].rstrip() + " Carta verificada con precios: truchas en 11 preparaciones "
                            "($28.000-$46.000), carnes, adicionales y desayunos. Pedido directo por WhatsApp.")
    f["timeInfo"] = "Carta con precios verificados"
    f["badge"] = "Carta verificada"
    f["tags"] = sorted(set(f.get("tags", []) + ["carta", "trucha", "bar", "mojarra"]))
    f["foodServiceDetails"] = {
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
    }
    f["photos"] = [
        U("/pautas/restaurante_bar_fonda_boquia/menu-carta1.jpeg"),
        U("/pautas/restaurante_bar_fonda_boquia/menu-carta2.jpeg"),
        U("/pautas/restaurante_bar_fonda_boquia/29389126_1005353112946875_6049563033867386880_n.jpg"),
    ]
    # elimina duplicado propio ID32
    data["places"] = [p for p in places if p["id"] != 32]
    pp.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    mp = PUB / "data/mapMarkers.json"
    mk = json.loads(mp.read_text(encoding="utf-8"))
    key = "markers" if "markers" in mk else "mapMarkers"
    mk[key] = [x for x in mk[key] if x.get("placeId") != 32]
    mp.write_text(json.dumps(mk, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Fonda fusionada en ID21, duplicado ID32 eliminado")

if __name__ == "__main__":
    main()
