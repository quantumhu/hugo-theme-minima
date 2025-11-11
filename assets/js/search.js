import * as params from '@params';

const search_input = document.querySelector("#search-input");
const search_result = document.querySelector("#search-result");

let fuse;

window.onload = async function() {
  const data = await fetch("../index.json").then(res => res.json());
  const optsJSON = params.search.fuse.options;
  const opts = JSON.parse(optsJSON);
  fuse = new Fuse(data, opts);
}

function escapeRegExp(text) {
  // From https://stackoverflow.com/a/3561711
  return text.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

search_input.addEventListener("input", function () {
  if (!fuse) return;
  const query = this.value.trim();
  const results = fuse.search(query);

  const regex = new RegExp(escapeRegExp(query), "gi");

  let html = '';
  if (results.length > 0) {
    for (const result of results) {
      var displayTitle = result.item.title;

      result.matches.forEach(match => {
        if (match.key == "title")
        {
          displayTitle = displayTitle.replace(regex, match => `<b>${match}</b>`);
        }
      });
      
      html += `<li class="mb-4"><a class="text-lg" href="${result.item.permalink}">${displayTitle}</a></li>`;
    }
  }

  if (html.length > 0)
  {
    search_result.innerHTML = html;
  }
  else
  {
    if (query.length <= 1)
    {
      search_result.innerHTML = `<li class="text-lg">${hugoTranslations.short}</li>`;
    }
    else
    {
      search_result.innerHTML = `<li class="text-lg">${hugoTranslations.none}</li>`;
    }
  }
})
