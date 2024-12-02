import axios from "axios";

export async function fetchWikipediaImages(query) {
    try {
        // Fetch the top matching article title
        const searchResponse = await axios.get("https://en.wikipedia.org/w/api.php", {
            params: {
                action: "query",
                list: "search",
                srsearch: query,
                format: "json",
                origin: "*",
            },
        });

        if (!searchResponse.data.query.search.length) {
            console.log("No matching articles found.");
            return;
        }

        const pageTitle = searchResponse.data.query.search[0].title;

        // Fetch the images and captions from the article
        const imagesResponse = await axios.get("https://en.wikipedia.org/w/api.php", {
            params: {
                action: "query",
                prop: "images",
                titles: pageTitle,
                format: "json",
                origin: "*",
            },
        });

        const pages = imagesResponse.data.query.pages;
        const imagesArray = [];

        for (const pageId in pages) {
            const page = pages[pageId];
            if (page.images) {
                for (const img of page.images) {
                    if (img.title) {
                        // Fetch image details like caption
                        const imgDetailsResponse = await axios.get(
                            "https://en.wikipedia.org/w/api.php",
                            {
                                params: {
                                    action: "query",
                                    titles: img.title,
                                    prop: "imageinfo",
                                    iiprop: "url|extmetadata",
                                    format: "json",
                                    origin: "*",
                                },
                            }
                        );

                        const imgPages = imgDetailsResponse.data.query.pages;
                        for (const imgPageId in imgPages) {
                            const imgInfo = imgPages[imgPageId];
                            const metadata = imgInfo.imageinfo && imgInfo.imageinfo[0]?.extmetadata;

                            imagesArray.push({
                                url: imgInfo.imageinfo[0]?.url,
                                caption: metadata?.ImageDescription?.value || img.title,
                            });
                        }
                    }
                }
            }
        }

        return imagesArray;
    } catch (error) {
        console.error("An error occurred while fetching data:", error);
    }
}
