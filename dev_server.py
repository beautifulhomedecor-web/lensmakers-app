import os
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

class NoCacheRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Force browsers and service workers to NEVER cache during local development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    server_address = ('0.0.0.0', port)
    httpd = ThreadingHTTPServer(server_address, NoCacheRequestHandler)
    print(f"Starting Multi-Threaded No-Cache Dev Server on port {port}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()
