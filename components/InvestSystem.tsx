import AWS from 'aws-sdk';

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIAUJ3VUKANTQKUIAXV',
  secretAccessKey: 'X8fTA+HvyfDLk0m3+u32gtcOyWe+yiJJZ0GegssZ',
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const userId = '1617526573'; // Replace dynamically if needed

async function checkPurchasedTasks() {
  try {
    const result = await dynamoDB
      .get({
        TableName: 'invest',
        Key: { UserID: userId },
      })
      .promise();

    if (!result.Item || !result.Item.purchasedTasks) return null;

    const purchasedTasks = result.Item.purchasedTasks;
    const currentDate = new Date();
    let tonBalance = 0;

    for (const [taskName, taskDetails] of Object.entries(purchasedTasks)) {
      if (typeof taskDetails === 'object' && taskDetails.date && taskDetails.type) {
        const taskDate = new Date(taskDetails.date);
        const price = Number(taskDetails.price);
        const reward = parseFloat(taskDetails.reward.replace('%', '')) / 100;

        let conditionMet = false;

        switch (taskDetails.type) {
          case 'weekly':
            conditionMet = currentDate.getTime() - taskDate.getTime() >= 14 * 24 * 60 * 60 * 1000;
            break;
          case 'monthly':
            conditionMet = currentDate.getTime() - taskDate.getTime() >= 30 * 24 * 60 * 60 * 1000;
            break;
          case 'yearly':
            conditionMet = currentDate.getTime() - taskDate.getTime() >= 365 * 24 * 60 * 60 * 1000;
            break;
        }

        if (conditionMet) {
          const calculatedReward = (price * reward) + price;
          tonBalance += calculatedReward;

          // Remove the task after processing
          delete purchasedTasks[taskName];
        }
      }
    }

    // Update the DynamoDB with the modified tasks and new balance
    await dynamoDB
      .update({
        TableName: 'invest',
        Key: { UserID: userId },
        UpdateExpression: 'set purchasedTasks = :tasks, tonBalance = tonBalance + :balance',
        ExpressionAttributeValues: {
          ':tasks': purchasedTasks,
          ':balance': tonBalance,
        },
      })
      .promise();

    return null; // Return null as specified
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export default checkPurchasedTasks;
