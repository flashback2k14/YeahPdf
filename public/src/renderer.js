const renderer = (() => {
  const _render = (entries, holderId, holderContainer) => {
    const ul = document.createElement('ul');
    ul.id = holderId;

    Object.values(entries).forEach((entry) => {
      const pageLi = document.createElement('li');
      pageLi.innerText = 'Seite ' + entry.page;
      pageLi.classList.add('page-list_item');

      const pageUl = document.createElement('ul');

      if (entry.fields.length === 0) {
        const noEntry = document.createElement('li');
        noEntry.innerText = 'keine Felder enthalten';
        noEntry.classList.add('no-entry_item');
        pageUl.appendChild(noEntry);
      } else {
        entry.fields.forEach((field) => {
          const liName = document.createElement('li');
          liName.innerText = 'Feldname: ' + field.name;
          liName.classList.add('entry_item');

          const fieldUl = document.createElement('ul');

          const liType = document.createElement('li');
          liType.innerText = 'Typ: ' + field.type;
          liType.classList.add('entry_item');

          const liValue = document.createElement('li');
          const value = field.value;

          liValue.innerText = `Wert: ${value}`;
          liValue.classList.add('entry_item');

          fieldUl.appendChild(liType);
          fieldUl.appendChild(liValue);

          liName.appendChild(fieldUl);
          pageUl.appendChild(liName);
        });
      }

      pageLi.appendChild(pageUl);
      ul.appendChild(pageLi);
    });

    holderContainer.appendChild(ul);
  };

  const _renderRaw = (entries, holderId, holderContainer) => {
    const holder = document.createElement('div');
    holder.id = holderId;

    Object.values(entries).forEach((entry) => {
      if (entry.fields.length === 0) {
        const pageHolder = document.createElement('div');
        const pageHeader = document.createElement('h4');
        pageHeader.innerText = 'Seite ' + entry.page;

        const pageSpan = document.createElement('span');
        pageSpan.innerText = 'keine Felder enthalten';
        pageSpan.classList.add('no-entry_item');

        pageHolder.appendChild(pageHeader);
        pageHolder.appendChild(pageSpan);

        holder.appendChild(pageHolder);
      } else {
        const pageHolder = document.createElement('div');
        const pageHeader = document.createElement('h4');
        pageHeader.innerText = 'Seite ' + entry.page;

        const pageCode = document.createElement('code');
        const pagePre = document.createElement('pre');
        pagePre.innerHTML = JSON.stringify(entry.raw, null, 2);
        pageCode.appendChild(pagePre);

        pageHolder.appendChild(pageHeader);
        pageHolder.appendChild(pageCode);

        holder.appendChild(pageHolder);
      }
    });

    holderContainer.appendChild(holder);
  };

  const _renderViewer = (pdf, id) => {
    const container = document.getElementById(id);
    const eventBus = new pdfjsViewer.EventBus();

    const pdfViewer = new pdfjsViewer.PDFViewer({
      container,
      eventBus,
    });

    eventBus.on('pagesinit', function () {
      pdfViewer.currentScaleValue = 'page-width';
    });

    pdfViewer.setDocument(pdf);
  };

  return {
    fields: _render,
    raw: _renderRaw,
    viewer: _renderViewer,
  };
})();
