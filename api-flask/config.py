import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/SoundAlertIA")
JWT_SECRET = os.getenv("JWT_SECRET", "5323e16709b230bb1764a10b640116c29e7723444fa4423a1824c3f9c47696e9aa5fe0d361948b8b005e36860b9fdeb853027a0b11a027b5183e120c522caea2")
