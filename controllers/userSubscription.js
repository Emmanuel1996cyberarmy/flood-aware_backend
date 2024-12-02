import SubscribeAlert from "../models/SubscribeAlert.js";
import { sendWelcomeEmail } from "../utils/emailTransporter.js";

export const subscribeToAlert = async (req, res) => {
    const {email, latitude, longitude, alertType="flood"} = req.body;

    try{
        if(!email || !latitude || !longitude) {
            return res.status(400).json({success: false, error: 'Email and location required'});
        }

        const existingUser = await SubscribeAlert.findOne({email})
        if(existingUser) {
            return res.status(400).json({success: false, error: 'You are already subscribed'})

        }
        
        const newSubscriber = new SubscribeAlert({email, latitude, longitude, alertType});
        await newSubscriber.save();
        await sendWelcomeEmail(newSubscriber)

        res.status(201).json({success: true, message: 'Successfully subscribed for alerts'})
    } catch(err){
        res.status(500).json({success: false, error: 'Failed to subscribe'})
    }

}

export const checkIfUserIsSubscribed = async(req, res) => {
 try {
  const {email} = req.body;
  if(!email) return res.status(400).json({success: false, message: 'email is required'})
  const existingSubscriber = await SubscribeAlert.findOne({email});
  if(existingSubscriber){
    res.status(200).json({
      success: true,
      message: 'User is Subscribed',
      data: existingSubscriber
    })
  } else{
    return res.status(404).json({ success: false, message: 'User is not subscribed' });
  }
 } catch (error) {
  res.status(500).json({ success: false, error: 'Failed to check subscription status' });
 }
}

export const unsubscribeFromAlert = async (req, res) => {
    const { email } = req.body;
  
    try {
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required' });
      }
  
      // Find and delete the subscriber
      const subscriber = await SubscribeAlert.findOneAndDelete({ email });
  
      if (!subscriber) {
        return res.status(404).json({ success: false, error: 'Subscription not found' });
      }
  
      res.status(200).json({ success: true, message: 'Successfully unsubscribed from alerts' });
    } catch (err) {
      console.error('Error during unsubscribe:', err);
      res.status(500).json({ success: false, error: 'Failed to unsubscribe' });
    }
  };
  