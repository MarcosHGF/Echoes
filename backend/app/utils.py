import secrets

def generate_state():
    return secrets.token_urlsafe(16)  # Generates a random 16-byte string