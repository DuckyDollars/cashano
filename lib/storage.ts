// lib/storage.ts
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',  // Replace this with your environment's method of managing secrets
  secretAccessKey: 'X8fTA+HvyfDLk0m3+u32gtcOyWe+yiJJZ0GegssZ',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'invest';

export async function saveReferral(userId: string, referrerId: string) {
  // First, try to get the user to check if it already exists
  const existingUserParams = {
    TableName: TABLE_NAME,
    Key: {
      UserID: userId,
    },
  };

  try {
    const existingUserResult = await dynamoDB.get(existingUserParams).promise();

    // If the user already exists, do not save anything
    if (existingUserResult.Item) {
      console.log(`User with UserID ${userId} already exists. No data saved.`);
      return; // Exit early without saving anything
    }

    // Otherwise, proceed to save the referral information
    const params = {
      TableName: TABLE_NAME,
      Key: {
        UserID: referrerId,
      },
      UpdateExpression: 'SET friends = list_append(if_not_exists(friends, :emptyList), :friendId)',
      ExpressionAttributeValues: {
        ':friendId': [userId],
        ':emptyList': [],
      },
      ReturnValues: 'UPDATED_NEW',
    };

    // Save the user's referral data
    await dynamoDB.update(params).promise();

    // Now save the user with their referrer information
    const userParams = {
      TableName: TABLE_NAME,
      Item: {
        UserID: userId,
        ReferrerID: referrerId,
      },
      ConditionExpression: 'attribute_not_exists(UserID)', // Ensure the item doesn't exist already
    };

    await dynamoDB.put(userParams).promise();
    console.log(`Referral and user data for ${userId} saved successfully.`);

  } catch (error) {
    console.error('Error saving referral to DynamoDB:', error);
  }
}

export async function getReferrals(userId: string): Promise<string[]> {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'UserID = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  };

  try {
    const result = await dynamoDB.query(params).promise();
    return result.Items?.map(item => item.ReferrerID) || [];
  } catch (error) {
    console.error('Error fetching referrals from DynamoDB:', error);
    return [];
  }
}

export async function getReferrer(userId: string): Promise<string | null> {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      UserID: userId,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    return result.Item ? result.Item.ReferrerID : null;
  } catch (error) {
    console.error('Error fetching referrer from DynamoDB:', error);
    return null;
  }
}

export async function getFriends(referrerId: string): Promise<string[]> {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      UserID: referrerId,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    return result.Item?.friends || [];
  } catch (error) {
    console.error('Error fetching friends from DynamoDB:', error);
    return [];
  }
}
