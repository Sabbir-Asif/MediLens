from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connectToMongo():
    db.client = AsyncIOMotorClient(settings.MONGODB_URL)

async def closeMongoConnection():
    if db.client:
        db.client.close()

async def getDatabase():
    return db.client[settings.DATABASE_NAME]