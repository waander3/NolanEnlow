#!/usr/bin/env python3
"""
Simple HTTP server to run the NBA Championship Predictor wheel.
Opens the page automatically in your default browser.
"""

import http.server
import socketserver
import webbrowser
import threading
import os

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)

def open_browser():
    """Open browser after a short delay to allow server to start."""
    import time
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}')

def main():
    # Start browser in a separate thread
    threading.Thread(target=open_browser, daemon=True).start()
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    main()
