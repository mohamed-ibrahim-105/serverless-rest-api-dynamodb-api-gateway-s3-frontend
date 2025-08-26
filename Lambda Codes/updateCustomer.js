import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    const customerId = event.pathParameters.customerId;
    const { firstName, lastName, email, phone, address } = JSON.parse(event.body);

    const params = {
        TableName: 'CustomerRecords',
        Key: { customerId },
        UpdateExpression: 'set firstName = :fn, lastName = :ln, email = :e, phone = :p, address = :a',
        ExpressionAttributeValues: {
            ':fn': firstName,
            ':ln': lastName,
            ':e': email,
            ':p': phone || null,
            ':a': address || null
        },
        ReturnValues: 'ALL_NEW'
    };

    try {
        const result = await docClient.send(new UpdateCommand(params));
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify(result.Attributes)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
