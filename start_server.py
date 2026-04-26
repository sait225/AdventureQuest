"""
QR Adventure Quest - Local Server Starter
==========================================
Bu script'i çalıştırın, bilgisayarınızın IP adresini bulur
ve HTTP sunucuyu başlatır. Aynı WiFi'deki tüm telefonlar
QR kodları tarayarak oyuna erişebilir.
"""

import http.server
import socket
import socketserver
import webbrowser
import os

PORT = 3000

def get_local_ip():
    """Bilgisayarın yerel IP adresini bulur."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    # QR adventure klasörüne geç
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    ip = get_local_ip()
    base_url = f"http://{ip}:{PORT}"

    print("=" * 55)
    print("  🗺️  QR ADVENTURE QUEST - SERVER  🗺️")
    print("=" * 55)
    print()
    print(f"  📡 Bilgisayar IP: {ip}")
    print(f"  🌐 Base URL:      {base_url}")
    print()
    print("  📱 QR kodları yazdırmak için tarayıcıda açın:")
    print(f"     {base_url}/print-qrcodes.html")
    print()
    print("  🎮 Oyunu test etmek için:")
    print(f"     {base_url}/index.html?step=1")
    print()
    print("  ⚠️  Tüm telefonlar aynı WiFi ağında olmalı!")
    print("  ❌ Durdurmak için Ctrl+C basın")
    print("=" * 55)

    # Tarayıcıda QR kod yazdırma sayfasını aç
    webbrowser.open(f"{base_url}/print-qrcodes.html")

    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("0.0.0.0", PORT), handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n  👋 Sunucu kapatıldı!")
            httpd.shutdown()
