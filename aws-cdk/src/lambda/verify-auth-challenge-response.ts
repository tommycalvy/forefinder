import {
    VerifyAuthChallengeResponseTriggerHandler,
    VerifyAuthChallengeResponseTriggerEvent
} from 'aws-lambda';

export const handler: VerifyAuthChallengeResponseTriggerHandler = async (event: VerifyAuthChallengeResponseTriggerEvent) => {
    const expectedAnswer = event.request.privateChallengeParameters.secretLoginCode;
    if (event.request.challengeAnswer === expectedAnswer) {
        event.response.answerCorrect = true;
    } {
        event.response.answerCorrect = false;
    }
    return event;
}