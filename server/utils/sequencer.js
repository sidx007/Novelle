import mongoose from 'mongoose';

const countersCollection = () => mongoose.connection.db.collection('counters');

export const getNextSequence = async (name, startAt = 1) => {
  const result = await countersCollection().findOneAndUpdate(
    { _id: name },
    [
      {
        $set: {
          seq: {
            $add: [
              { $ifNull: ['$seq', startAt - 1] },
              1
            ]
          }
        }
      }
    ],
    {
      upsert: true,
      returnDocument: 'after'
    }
  );

  const doc = result?.value ?? result;
  return (doc && typeof doc.seq === 'number') ? doc.seq : startAt;
};

export const ensureSequence = async (name, startAt = 1) => {
  await countersCollection().updateOne(
    { _id: name },
    {
      $setOnInsert: { seq: startAt - 1 }
    },
    { upsert: true }
  );
};

export default {
  getNextSequence,
  ensureSequence
};
