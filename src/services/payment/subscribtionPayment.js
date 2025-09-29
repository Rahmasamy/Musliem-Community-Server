export const createSubscrbtion = async(req,res) => {
     try {
    const { planId, userId, planName } = req.body;

    let request = new paypal.subscriptions.SubscriptionsCreateRequest();
    request.requestBody({
      plan_id: planId,
      application_context: {
        brand_name: "Community App",
        return_url: "http://localhost:5173/success-payment",
        cancel_url: "http://localhost:5173/failed-payment",
      },
    });

    let response = await paypalClient.client().execute(request);

    // Save subscription with "PENDING" status
    await Subscription.create({
      user: userId,
      planName,
      paypalSubscriptionId: response.result.id,
      status: "PENDING",
    });

    res.json({
      subscriptionId: response.result.id,
      links: response.result.links,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating subscription");
  }
}