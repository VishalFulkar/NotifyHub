import Redis from 'redis';

const redis = Redis.createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

redis.on("error", (err) => {
    console.log("Redis error", err);
});

export async function connectRedis() {
    try {
        await redis.connect();
        console.log("Redis connected");
    }
    catch (err: unknown) {
        console.log("Redis connection error: ", err);
    }
}

export default redis;