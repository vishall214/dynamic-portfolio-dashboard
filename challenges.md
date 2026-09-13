# Challenges

The project looked pretty straightforward at first, but most of the main time went into dealing with the stock data sources and making sure failed requests didn't break thedashboard. These were the main problems I ran into while building it.

The portfolio holdings and their initial values are taken from the provided Excel sheet and converted into structured data for the site.

## 1. Using unofficial data

The assignment needs CMP from YahooFinance and P/E Ratio and LatestEarnings from google finance. There isnt a simple official public API that has everything needed, so I used`yahoo-finance2` and webscraped google finance page using Cheerio library.

## 2. Different NSE/BSE symbols 

The stock is using different symbols depending on the source of it. 

Ex:

- yahoo finance: `HDFCBANK.NS`
- google finance: `HDFCBANK:NSE`

For BSE:

- yahoo finance: `532174.BO`
- google finance: `532174:BOM`

## 3. Finding the needed values on Google Finance

The google finance page did not show all the needed values in a simple way.

The `Earnings per share` section showed `——` for some stocks, null vales.

then after checking the page content, I found that the quarterly `Net income` value was available and used that in `Latest Earnings` value.

## 4. Handling Yahoo and Google failures differently

Initially, both yahoo and Google Finance were inside the same `Promise.all`.

means if Yahoo failed for a stock, the whole process failed and i lost the google finance data too.

i changed this so the two sources have separate `try/catch` blocks. now a Yahoo failure only affects CMP, while Google Finance can still give P/E and Latest Earnings.

## 5. There are missing CMP for some BSE stocks

in testing, yahoo finance showed no CMP for several BSE stocks.

instead of stopping the entire request, I return `null` for the missing value to load normally.

Tthen the frontend will handle missing values instead of assuming every stock would have complete data.

## 6. Converting Google Finance values

google finance returns some financial values in formats such as `192.45B` or `153M`.

because the rest of the application works with numbers, I had to convert these values into their exactnumeric form before sending them to frontend.

Ex:`192.45B` is actually `192450000000`.

## 7. Avoiding many external requests

The dashboard updates every 15 seconds, so fetching every stock from both sources on every refresh could make lots requests.

added a simple in-memory cache with a 12-second expiration. so it lets the dashboard to refresh frequently without unnecessarily requesting the same data again and again.

## 8. Making the 15-second refresh work

The dashboard uses `setInterval`function to fetch the data every 15 seconds.

in testing, for a simple way to confirm it, so I used the `fetchedAt` value returned by the API and showed a `Last updated` time on the starting of the page.

this made it easy to see the timestamp changing while testing.

## 9. Calculation, grouping, and handling unexpected data

The API gives the stock info, but values like Investment, Present Value, Gain/Loss and Portfolio% should be calculated by us.

i kept these calculations in `portfolio-utils.ts` it is also used foe grouping stocks by sector and to calculate total sector values.

in testing, a yahoo finance response also returned with unusual CMP value
Ex: Fine Organic:`10603328500`

This shows that even when the external request succeeded, the returned values should not be assumed as correct.

For the assignment i kept the implementation simple and handled unavailable data, but in production version we could add stronger validation and data checking before processing.

