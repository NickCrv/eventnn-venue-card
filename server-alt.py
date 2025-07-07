#!/usr/bin/env python3
"""
Alternative Safe HTTP Server for EventNN Venue
Uses port 3000 to avoid potential conflicts with port 8000
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Configuration
PORT = 3000  # Alternative port
HOST = '127.0.0.1'  # Only bind to localhost
DIRECTORY = Path(__file__).parent

class SafeHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom request handler with safety measures"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)
    
    def end_headers(self):
        # Add security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        super().end_headers()
    
    def log_message(self, format, *args):
        # Custom logging
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    """Main server function"""
    try:
        # Change to the project directory
        os.chdir(DIRECTORY)
        
        # Create server
        with socketserver.TCPServer((HOST, PORT), SafeHTTPRequestHandler) as httpd:
            print(f"🚀 Alternative Safe HTTP Server started")
            print(f"📍 Server running at: http://{HOST}:{PORT}")
            print(f"📁 Serving directory: {DIRECTORY}")
            print(f"🔒 Bound to localhost only (safe mode)")
            print(f"⏹️  Press Ctrl+C to stop the server")
            print("-" * 50)
            
            # Start server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Error: Port {PORT} is already in use")
            print(f"💡 Try using a different port or stop the existing server")
        else:
            print(f"❌ Server error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 