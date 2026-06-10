
const fs = require('fs');

const GOODLIFEAPI = "https://www.goodlifefitness.com/content/goodlife/en/class-schedule/jcr:content/root/responsivegrid/getclassschedule.GetClasses.7.undef.undef.";

const compiledPrograms = [];
const usedIds = new Map();

function formatProgram(rawData, url) {

    const tags = rawData.program.categories.map((item) => item.name);

    return {
        id: `hl-waterloo-goodlife-${rawData.classId}`,
        programName: rawData.program.name,
        organizationName: "GoodLife",
        street: "",
        location: "GoodLife",
        province: "",
        postalCode: "",
        areaServed: "",
        description: rawData.program.classDescription,
        eligibility: "",
        fees: "Goodlife membership",
        duration: rawData.classDuration,
        language: "English",
        phone: "",
        email: "",
        infosourceurl: url,
        infosourcename: "goodlife",
        tags,
        website: rawData.classDetailsPagePath
    };
}

async function scrapeGoodLifeDay(url) {

    console.log("Fetching live class data from GoodLife...");


    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const rawData = await response.json();

    const classesArray = rawData?.map?.response?.[0]?.classes || [];

    for (let i = 0; i < classesArray.length; i++) {
        const item = classesArray[i];

        if (item.program.identifier && item.program.name) {
            const id = item.program.identifier;
            const name = item.program.name;

            if (!usedIds.has(id)) {
                const program = await formatProgram(item, url);
                compiledPrograms.push(program);

                usedIds.set(id, [name]);
            } else {
                // the names already used for the id
                const existingNames = usedIds.get(id);

                if (existingNames.includes(name)) {
                    console.log("Already used: ", id, name);
                } else {
                    // there are some programs that have the same
                    const program = await formatProgram(item, url);
                    compiledPrograms.push(program);

                    existingNames.push(name);
                    usedIds.set(id, existingNames);
                }
            }
        } else {
            console.log("No identifier or name found for", classesArray[i]);
        }
    }

}
async function scrapeDaysOfGoodlife(numDays) {
    const now = new Date();

    
    for (let i = 0; i < numDays; i++) {
        now.setDate(now.getDate() + 1);


        console.log("Getting day: ", now.toISOString().slice(0, 10));

        try {
            await scrapeGoodLifeDay(GOODLIFEAPI+now.toISOString().slice(0, 10)+".json");
        } catch {
            console.log("failed getting data for ", now.toISOString().slice(0, 10));
            console.log("Continuing");
        }
    }

    fs.writeFileSync('goodlife-programs.json', JSON.stringify(compiledPrograms, null, 2), 'utf-8');
    console.log("Saved dataset directly to goodlife-programs.json");
}


scrapeDaysOfGoodlife(14);

// console.log("FINAL >>>>>> ", compiledPrograms);
