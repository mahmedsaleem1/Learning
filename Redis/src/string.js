import {redis} from "./redis.js";

async function init() {
    /* String Operations

    await redis.set("msg:2", "Hello World!");
    await redis.expire("msg:2", 60); // Set expiration time to 60 seconds
    console.log("Set msg:2 = Hello World!");
    
    // Get the value
    const value = await redis.get("msg:2");
    console.log("Got msg:2 =", value);

    */

    /* List Operations
    
    await redis.lpush("mylist", "Hello");
    await redis.rpush("mylist", "World");
    const listItems = await redis.lrange("mylist", 0, -1);
    console.log("List items:", listItems);

    */

    // Disconnect
    redis.disconnect();
}

init();