import bcrypt from 'bcrypt';

export async function getRandomId(connection, displayName) {
    console.log("displayName:", displayName);
    const [existingIds] = await connection.execute(
        "SELECT displayId FROM users WHERE displayName = ?",
        [displayName]
    );

    if (existingIds.length > 10000) {
        await connection.end();
        return NextResponse.json(
            { errors: [{ msg: "Too many users with this name", path: "displayName" }] },
            { status: 121 }
        );
    } else {
        let array = [];
        let setArray = new Set(existingIds);

        for (let i = 0; i < 10000; i++) {
            array.push(String(i).padStart(4, '0'));
        }

        let filteredArray = array.filter(num => !setArray.has(num));

        let rndNum = Math.floor(Math.random() * filteredArray.length);

        return filteredArray[rndNum];
    }
}

export async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Unable to hash password");
    }
}