import {
    CreateAuthChallengeTriggerHandler,
    CreateAuthChallengeTriggerEvent,
} from "aws-lambda";
import { randomBytes } from "crypto";
import {
    SESv2Client,
    SendEmailCommand,
    SendEmailCommandInput,
} from "/opt/nodejs/aws-sdk-utils";

const client = new SESv2Client({ region: "REGION" });

export const handler: CreateAuthChallengeTriggerHandler = async (
    event: CreateAuthChallengeTriggerEvent
) => {
    let secretLoginCode: string;
    if (!event.request.session || !event.request.session.length) {
        // This is a new auth session
        // Generate a new magic link with the secret login code and mail it to the user
        secretLoginCode = randomDigits(6).join("");
        await sendEmail(event.request.userAttributes.email, secretLoginCode);
    } else {

        // There's an existing session. Don't generate new digits but
        // re-use the code from the current session. This allows the user to
        // make a mistake when keying in the code and to then retry, rather
        // the needing to e-mail the user an all new code again.   
        const previousChallenge = event.request.session.slice(-1)[0];
        secretLoginCode = previousChallenge.challengeMetadata!.match(/CODE-(\d*)/)![1];
    }

    // This is sent back to the client app
    event.response.publicChallengeParameters = {
        email: event.request.userAttributes.email
    };

    // Add the secret login code to the private challenge parameters
    // so it can be verified by the "Verify Auth Challenge Response" trigger
    event.response.privateChallengeParameters = { secretLoginCode };

    // Add the secret login code to the session so it is available
    // in a next invocation of the "Create Auth Challenge" trigger
    event.response.challengeMetadata = `CODE-${secretLoginCode}`;

    return event;
};

const BASE_URL = `http://localhost:3000/verify`;

async function sendEmail(emailAddress: string, secretLoginCode: string) {
    // async/await.
    try {
        const MAGIC_LINK = `${BASE_URL}?email=${emailAddress}&code=${secretLoginCode}`;

        const html = `
            <html><body>
            <p>Here's your link:</p>
            <h3>
            <a target="_blank" rel="noopener noreferrer" href="${MAGIC_LINK}">Click to sign-in</a>
            </h3>
            </body></html>
            `.trim();

        const params: SendEmailCommandInput = {
            /** input parameters */
            Destination: {
                ToAddresses: [emailAddress],
            },
            FromEmailAddress: "forefinder.noreply@gmail.com",
            Content: {
                Simple: {
                    Subject: {
                        Charset: "UTF-8",
                        Data: "forefinder Login Link",
                    },
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: html,
                        },
                    },
                },
            },
        };
        const command = new SendEmailCommand(params);
        await client.send(command);
        // process data.
    } catch (error) {
        // error handling.
    } finally {
        // finally.
    }
}

let randomNumber: number;

function randomDigit() {
    while (true) {
        randomNumber = randomBytes(1)[0];

        if (randomNumber < 250) {
            return randomNumber % 10;
        }
    }
}

function randomDigits(nr: number) {
    return [...Array(nr)].map(() => randomDigit());
}
