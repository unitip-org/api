import { database } from "@/lib/database";
import { APIResponse } from "@/lib/models/api-response";

export const GET = async () => {
  try {
    const query = database
      .selectFrom("service_prices as sp")
      .select(["sp.category", "sp.title", "sp.min_price", "sp.max_price"])
      .orderBy("sp.category asc")
      .orderBy("sp.title asc");
    const result = await query.execute();

    interface Price {
      title: string;
      min_price: number;
      max_price: number;
    }

    interface Category {
      title: string;
      prices: Price[];
    }

    const groupedPrices = result.reduce((acc, current) => {
      const categoryIndex = acc.findIndex(
        (it) => it.title === current.category
      );

      if (categoryIndex !== -1) {
        acc[categoryIndex].prices.push({
          title: current.title,
          min_price: current.min_price,
          max_price: current.max_price,
        });
      } else {
        acc.push({
          title: current.category,
          prices: [
            {
              title: current.title,
              min_price: current.min_price,
              max_price: current.max_price,
            },
          ],
        });
      }

      return acc;
    }, <Category[]>[]);

    return APIResponse.respondWithSuccess({
      categories: groupedPrices,
    });
  } catch (e) {
    console.log(e);
    return APIResponse.respondWithServerError();
  }
};
