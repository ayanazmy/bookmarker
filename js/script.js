const siteNameInput = document.getElementById('siteName');
const siteUrlInput = document.getElementById('siteUrl');
const searchInput = document.getElementById('searchInput');
const bookmarks = document.getElementById('bookmarks');
const noBookmarks = document.getElementById('no-bookmarks');
const validateName = document.querySelector('.validate-name');
const validateUrl = document.querySelector('.validate-url');
const submitBtn = document.getElementById('submitBtn');
const deleteBtn = document.getElementById('deleteBtn');
const regex = {
    siteName: {
        value: /^[a-zA-Z\s]{3,15}$/,
        isValid: false
    },
    siteUrl: {
        value: /^(http(s)?:\/\/)(www.)?[a-zA-Z0-9]{3,}.(com|org|net)$/,
        isValid: false
    }
}
const sites = JSON.parse(localStorage.getItem('sites')) || [];
displaySites(sites, false);

window.addEventListener('load', clearForm);
submitBtn.addEventListener('click', addSite);




function addSite() {
    const siteObj = {
        siteName: siteNameInput.value,
        siteUrl: siteUrlInput.value,
        id: sites.length > 0 ? sites[sites.length - 1].id + 1 : 0
    }
    submitBtn.disabled = false;
    regex.siteName.isValid = false;
    regex.siteUrl.isValid = false;
    sites.push(siteObj);
    localStorage.setItem('sites', JSON.stringify(sites));
    displaySites(sites, false);
    clearForm();
}

function displaySites(sitesToDisplay, isSearch) {
    if(isSearch) {
        if (sitesToDisplay.length === 0) {
            noBookmarks.classList.add('d-none');
            searchInput.classList.remove('d-none');
        } 
    } else {
        if (sitesToDisplay.length === 0) {
            noBookmarks.classList.remove('d-none');
            searchInput.classList.add('d-none');
        } else {
            noBookmarks.classList.add('d-none');
            searchInput.classList.remove('d-none');
        }
    }


    let sitesContent =``   
    for (let i = 0; i < sitesToDisplay.length; i++) {
        sitesContent +=
            `
                <div class="row bookmark-item  m-2 justify-content-between" id="bookmarkItem">
                    <div class="col-5 name text-start">${sitesToDisplay[i].siteName}</div>
                    <div class="col-5 visit">
                        <a href="${sitesToDisplay[i].siteUrl}" target="_blank"><i class="fa-solid fa-eye"></i> Visit</a>
                    </div>
                    <div class="col-1 delete text-end">
                        <i class="fa-solid fa-xmark" id="deleteBtn" onclick="deleteSite(${sitesToDisplay[i].id})"></i>
                    </div>
                </div>
            `
    }
    bookmarks.innerHTML = sitesContent;

}

function clearForm() {
    siteNameInput.value = '';
    siteUrlInput.value = '';
    searchInput.value = '';
    submitBtn.disabled = true;
    siteNameInput.classList.remove('is-valid');
    siteUrlInput.classList.remove('is-valid');
}

function deleteSite(id) {
    sites.forEach(site => {
        if (site.id === id) {
            sites.splice(sites.indexOf(site), 1);
            localStorage.setItem('sites', JSON.stringify(sites));
            displaySites(sites, false);
            return;
        }
    })
}

function validateInputs(input) {
    if (regex[input.id].value.test(input.value)) {
        input.nextElementSibling.classList.add('d-none');
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        regex[input.id].isValid = true;
    } else {
        input.nextElementSibling.classList.remove('d-none');
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        regex[input.id].isValid = false;
    }
    toggleSubmitBtn();
}

function toggleSubmitBtn() {
    if (regex.siteName.isValid && regex.siteUrl.isValid) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

function search(searchInput) {
    const result = [];
    sites.forEach(site => {
        if(site.siteName.toLowerCase().includes(searchInput.value.toLowerCase())) {
            result.push(site);
        }
    });
    displaySites(result, true);
}