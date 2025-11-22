import cron from "node-cron";
import Service from "../../models/Service/Service.model.js";
import DeletedAd from "../../models/deletedAds/detedAds.model.js";

// ✳️ Cron job runs every day at midnight
export const adCleanupCronJob = () => {
cron.schedule("0 0  * * *", async () => {
  try {
    const now = new Date();

    const expiredAds = await Service.find({
      serviceType: "advertisement",
      "extraDetails.endDate": { $lt: now }
    });

    if (expiredAds.length === 0) {
      console.log("📭 No expired ads found today");
      return;
    }
    const deletedRecords = expiredAds.map(ad => ({
      originalAdId: ad._id,
      user: ad.user,
      name: ad.name,
      description: ad.description,
      image: ad.image,
      extraDetails: ad.extraDetails
    }));

    await DeletedAd.insertMany(deletedRecords);

    const result = await Service.deleteMany({
      _id: { $in: expiredAds.map(ad => ad._id) }
    });

    console.log(`🗑️ Deleted ${result.deletedCount} expired ads and archived them.`);
  } catch (err) {
    console.error("❌ Cron job error:", err);
  }
})

};
