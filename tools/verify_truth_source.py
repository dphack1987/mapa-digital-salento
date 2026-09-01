#!/usr/bin/env python3
"""
Sistema de Verificación de Fuente de Verdad Única
Asegura que los scripts Python se ejecuten correctamente como fuente de verdad
para Salento Quindío bajo la marca salentoalamano
"""

import subprocess
import json
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any

ROOT = Path(__file__).resolve().parents[1]
LOGS_DIR = ROOT / "tools" / "logs"
LOGS_DIR.mkdir(exist_ok=True)

class TruthSourceVerifier:
    def __init__(self):
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "scripts": {},
            "overall_status": "unknown"
        }
    
    def run_script(self, script_name: str, args: List[str] = None) -> Dict[str, Any]:
        """Ejecuta un script y captura el resultado"""
        script_path = ROOT / "tools" / script_name
        if not script_path.exists():
            return {
                "status": "error",
                "error": f"Script not found: {script_path}"
            }
        
        try:
            cmd = ["python", str(script_path)]
            if args:
                cmd.extend(args)
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300,
                cwd=str(ROOT)
            )
            
            return {
                "status": "success" if result.returncode == 0 else "error",
                "returncode": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "execution_time": datetime.now().isoformat()
            }
        except subprocess.TimeoutExpired:
            return {
                "status": "timeout",
                "error": "Script execution timeout"
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
    
    def verify_normalize_brand_domains(self) -> Dict[str, Any]:
        """Verifica el script de normalización de dominios"""
        print("Verificando normalize_brand_domains.py...")
        result = self.run_script("normalize_brand_domains.py")
        
        verification = {
            "script": "normalize_brand_domains.py",
            "result": result,
            "verification": self._check_brand_normalization(result)
        }
        
        print(f"Estado: {verification['verification']['status']}")
        return verification
    
    def verify_seo_brand_audit(self) -> Dict[str, Any]:
        """Verifica el script de auditoría SEO de marca"""
        print("Verificando seo_brand_audit.py...")
        result = self.run_script("seo_brand_audit.py")
        
        verification = {
            "script": "seo_brand_audit.py",
            "result": result,
            "verification": self._check_seo_audit(result)
        }
        
        print(f"Estado: {verification['verification']['status']}")
        return verification
    
    def verify_search_intent_scanner(self) -> Dict[str, Any]:
        """Verifica el script de scanner de intención de búsqueda"""
        print("Verificando search_intent_scanner.py...")
        
        # Ejecutar con límite pequeño para verificación rápida
        result = self.run_script(
            "search_intent_scanner.py",
            ["--providers", "google", "--limit", "2", "--output", "tools/salento_search_scan_verify.json"]
        )
        
        verification = {
            "script": "search_intent_scanner.py",
            "result": result,
            "verification": self._check_search_scanner(result)
        }
        
        print(f"Estado: {verification['verification']['status']}")
        return verification
    
    def _check_brand_normalization(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Verifica que la normalización de marca funcione correctamente"""
        if result["status"] != "success":
            return {
                "status": "failed",
                "reason": "Script execution failed"
            }
        
        stdout = result.get("stdout", "")
        
        # Verificar que mencione archivos actualizados
        if "ARCHIVOS ACTUALIZADOS" in stdout:
            return {
                "status": "passed",
                "reason": "Brand normalization working correctly",
                "files_updated": stdout.count("UPDATED")
            }
        
        return {
            "status": "warning",
            "reason": "No files needed update (may be clean)"
        }
    
    def _check_seo_audit(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Verifica que la auditoría SEO detecte correctamente la marca"""
        if result["status"] != "success":
            return {
                "status": "failed",
                "reason": "Script execution failed"
            }
        
        stdout = result.get("stdout", "")
        
        # Verificar que escanee archivos
        if "Archivos escaneados:" in stdout:
            # Extraer número de archivos
            try:
                files_line = [line for line in stdout.split('\n') if 'Archivos escaneados:' in line][0]
                files_count = int(files_line.split(':')[-1].strip())
                
                # Verificar que detecte la marca
                brand_detected = "salentoalamano.com" in stdout.lower() or "salento a la mano" in stdout.lower()
                old_domains_clean = "mapa-salento.com" not in stdout.lower() or "0 hits" in stdout
                
                return {
                    "status": "passed" if brand_detected else "warning",
                    "reason": "SEO audit working correctly",
                    "files_scanned": files_count,
                    "brand_detected": brand_detected,
                    "old_domains_clean": old_domains_clean
                }
            except (IndexError, ValueError):
                pass
        
        return {
            "status": "failed",
            "reason": "Could not parse audit results"
        }
    
    def _check_search_scanner(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Verifica que el scanner de intención funcione correctamente"""
        if result["status"] != "success":
            return {
                "status": "failed",
                "reason": "Script execution failed"
            }
        
        # Verificar que se generó el archivo JSON
        output_file = ROOT / "tools" / "salento_search_scan_verify.json"
        if output_file.exists():
            try:
                with open(output_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                return {
                    "status": "passed",
                    "reason": "Search scanner working correctly",
                    "queries_analyzed": data.get("queries_analyzed", 0),
                    "providers": data.get("providers", []),
                    "has_intent_distribution": "intent_distribution" in data
                }
            except (json.JSONDecodeError, KeyError) as e:
                return {
                    "status": "failed",
                    "reason": f"Could not parse output JSON: {e}"
                }
        
        return {
            "status": "failed",
            "reason": "Output file not generated"
        }
    
    def run_all_verifications(self) -> Dict[str, Any]:
        """Ejecuta todas las verificaciones"""
        try:
            print("Iniciando verificacion de fuente de verdad unica...")
            print(f"Directorio raiz: {ROOT}")
            print(f"Directorio de logs: {LOGS_DIR}")
            print()
        except Exception as e:
            print(f"Error imprimiendo informacion: {e}")
        
        # Ejecutar verificaciones
        scripts_results = []
        
        try:
            # 1. Normalización de marca
            scripts_results.append(self.verify_normalize_brand_domains())
        except Exception as e:
            print(f"Error en normalize_brand_domains: {e}")
            scripts_results.append({
                "script": "normalize_brand_domains.py",
                "result": {"status": "error", "error": str(e)},
                "verification": {"status": "failed", "reason": str(e)}
            })
        
        try:
            # 2. Auditoría SEO
            scripts_results.append(self.verify_seo_brand_audit())
        except Exception as e:
            print(f"Error en seo_brand_audit: {e}")
            scripts_results.append({
                "script": "seo_brand_audit.py",
                "result": {"status": "error", "error": str(e)},
                "verification": {"status": "failed", "reason": str(e)}
            })
        
        try:
            # 3. Scanner de intención
            scripts_results.append(self.verify_search_intent_scanner())
        except Exception as e:
            print(f"Error en search_intent_scanner: {e}")
            scripts_results.append({
                "script": "search_intent_scanner.py",
                "result": {"status": "error", "error": str(e)},
                "verification": {"status": "failed", "reason": str(e)}
            })
        
        # Calcular estado general
        passed = sum(1 for r in scripts_results if r["verification"]["status"] == "passed")
        total = len(scripts_results)
        
        overall_status = "passed" if passed == total else "partial" if passed > 0 else "failed"
        
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "overall_status": overall_status,
            "scripts_verified": total,
            "scripts_passed": passed,
            "scripts_results": scripts_results,
            "recommendations": self._generate_recommendations(scripts_results)
        }
        
        try:
            print()
            print(f"Resumen: {passed}/{total} scripts verificados correctamente")
            print(f"Estado general: {overall_status.upper()}")
        except Exception as e:
            print(f"Error imprimiendo resumen: {e}")
        
        return self.results
    
    def _generate_recommendations(self, results: List[Dict[str, Any]]) -> List[str]:
        """Genera recomendaciones basadas en los resultados"""
        recommendations = []
        
        for result in results:
            if result["verification"]["status"] == "failed":
                recommendations.append(
                    f"WARNING {result['script']}: {result['verification']['reason']}"
                )
            elif result["verification"]["status"] == "warning":
                recommendations.append(
                    f"INFO {result['script']}: {result['verification']['reason']}"
                )
        
        if not recommendations:
            recommendations.append("SUCCESS All scripts working correctly as single source of truth")
        
        return recommendations
    
    def save_report(self) -> Path:
        """Guarda el reporte de verificación"""
        report_path = LOGS_DIR / f"truth_source_verification_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        
        print(f"📄 Reporte guardado en: {report_path}")
        return report_path

def main():
    verifier = TruthSourceVerifier()
    results = verifier.run_all_verifications()
    report_path = verifier.save_report()
    
    # Salir con código apropiado
    if results["overall_status"] == "failed":
        sys.exit(1)
    elif results["overall_status"] == "partial":
        sys.exit(2)
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()