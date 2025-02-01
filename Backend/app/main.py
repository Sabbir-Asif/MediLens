from fastapi import FastAPI
from app.routes.userRouter import router as userRouter
from app.routes.chatRouter import router as chatRouter
from app.core.database import connectToMongo, closeMongoConnection
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="MediLens Management API",
    description="API endpoints for managing users",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace '*' with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startupDbClient():
    await connectToMongo()

@app.on_event("shutdown")
async def shutdownDbClient():
    await closeMongoConnection()

app.include_router(userRouter, prefix="/api/users", tags=["Users"])
app.include_router(chatRouter, prefix="/api/chats", tags=["Chats"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="127.0.0.1", 
        port=8000, 
        reload=True 
    )  # Correctly closed parentheses here
