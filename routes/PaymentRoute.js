const router = require('express').Router();
const stripe = require('stripe')('sk_test_51J03ifFhTtqd1jfZjLItazGWnr27lutzKdN9cgJiOna3UTO2DYUkKegRB2flEURW8pRbgFIMxmJoulsVpLFfZgz400MB00sv13');

router.post('/', async (req, res) => {
    const { product, token } = req.body;
    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });
        const idempotencyKey = Math.random();
        const charge = await stripe.charges.create(
            {
                amount: product.price,
                currency: "usd",
                customer: customer.id,
                receipt_email: token.email,
                description: "Thanks For Purchased FlipKart Products",
                shipping: {
                    name: token.card.name,
                    address: {
                        line1: token.card.address_line1,
                        line2: token.card.address_line2,
                        city: token.card.address_city,
                        country: token.card.address_country,
                        postal_code: token.card.address_zip
                    }
                }
            },
            {
                idempotencyKey
            }
        );
        if (charge.status === "succeeded") return res.json({ status: "success", charge: charge })
    } catch (error) {
        return res.json({ status: "error" })
    }
})

module.exports = router;