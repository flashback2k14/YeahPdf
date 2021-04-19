((UTILS, RENDERER) => {
  const PDF = {
    tabcontent: document.getElementsByClassName('tabcontent-pdfs'),
    tablinks: document.getElementsByClassName('tablinks-pdfs'),
  };

  const FIELDS = {
    tabcontent: document.getElementsByClassName('tabcontent-fields'),
    tablinks: document.getElementsByClassName('tablinks-fields'),
  };

  const LEFT = {
    dropZone: document.getElementById('dropZoneLeftPdf'),
    dropzoneInfo: document.getElementById('dropzoneInfoLeftPdf'),
    pdfFile: document.getElementById('fileLeftPdf'),
    dropzoneFile: document.getElementById('dropzoneFileLeftPdf'),
    dropzoneFileName: document.getElementById('dropzoneFileNameLeftPdf'),
    formFieldsNoEntries: document.getElementById('formFieldsNoEntriesLeftPdf'),
    formFieldsContainer: document.getElementById('formFieldsContainerLeftPdf'),
    tabcontent: document.getElementsByClassName('tabcontent-pdf_left'),
    tablinks: document.getElementsByClassName('tablinks-pdf_left'),
    simplifiedFormFields: document.getElementById('simplifiedFormFieldsLeftPdf'),
    rawFormFields: document.getElementById('rawFormFieldsLeftPdf'),
    isNew: true,
    formFields: {},
  };

  const RIGHT = {
    dropZone: document.getElementById('dropZoneRightPdf'),
    dropzoneInfo: document.getElementById('dropzoneInfoRightPdf'),
    pdfFile: document.getElementById('fileRightPdf'),
    dropzoneFile: document.getElementById('dropzoneFileRightPdf'),
    dropzoneFileName: document.getElementById('dropzoneFileNameRightPdf'),
    formFieldsNoEntries: document.getElementById('formFieldsNoEntriesRightPdf'),
    formFieldsContainer: document.getElementById('formFieldsContainerRightPdf'),
    tabcontent: document.getElementsByClassName('tabcontent-pdf_right'),
    tablinks: document.getElementsByClassName('tablinks-pdf_right'),
    simplifiedFormFields: document.getElementById('simplifiedFormFieldsRightPdf'),
    rawFormFields: document.getElementById('rawFormFieldsRightPdf'),
    isNew: true,
    formFields: {},
  };

  const DIFF = {
    container: document.getElementById('diffingContainer'),
    isNew: true,
  };

  /**
   * DROPZONE
   */

  const _toggleDropzoneLeft = () => {
    if (!LEFT.isNew) {
      return;
    }

    LEFT.isNew = !LEFT.isNew;

    LEFT.dropzoneInfo.classList.toggle('active');
    LEFT.dropzoneInfo.classList.toggle('hidden');
    LEFT.dropzoneFile.classList.toggle('active');
    LEFT.dropzoneFile.classList.toggle('hidden');

    LEFT.formFieldsNoEntries.classList.toggle('active');
    LEFT.formFieldsNoEntries.classList.toggle('hidden');
    LEFT.formFieldsContainer.classList.toggle('active');
    LEFT.formFieldsContainer.classList.toggle('hidden');
  };

  const _initDropzoneLeft = (droppedFile) => {
    LEFT.dropzoneFileName.innerText = droppedFile.name;
    LEFT.dropZone.style.borderColor = 'blue';
  };

  const _handleDropLeft = (ev) => {
    ev.preventDefault();

    UTILS.clearList([
      UTILS.CONSTANTS.LEFT.formFieldList,
      UTILS.CONSTANTS.LEFT.rawFieldList,
      UTILS.CONSTANTS.DIFF.container,
    ]);
    LEFT.formFields = {};
    DIFF.isNew = true;

    const droppedFile = UTILS.getPdfFile(ev);

    _toggleDropzoneLeft();
    _initDropzoneLeft(droppedFile);

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      const formFields = await UTILS.getPdfContent(pdf, pdf.numPages);
      LEFT.formFields = formFields;
      RENDERER.fields(formFields, UTILS.CONSTANTS.LEFT.formFieldList, LEFT.simplifiedFormFields);
      RENDERER.raw(formFields, UTILS.CONSTANTS.LEFT.rawFieldList, LEFT.rawFormFields);
      RENDERER.viewer(pdf, UTILS.CONSTANTS.LEFT.viewer);
      document.getElementById('defaultOpenTabFieldsLeft').click();
    };

    fileReader.readAsArrayBuffer(droppedFile);
  };

  const _handleDragOverLeft = (ev) => {
    ev.preventDefault();
    LEFT.dropZone.style.borderColor = 'red';
  };

  const _handleDragLeaveLeft = (ev) => {
    ev.preventDefault();
    LEFT.dropZone.style.borderColor = 'blue';
  };

  const _toggleDropzoneRight = () => {
    if (!RIGHT.isNew) {
      return;
    }

    RIGHT.isNew = !RIGHT.isNew;

    RIGHT.dropzoneInfo.classList.toggle('active');
    RIGHT.dropzoneInfo.classList.toggle('hidden');
    RIGHT.dropzoneFile.classList.toggle('active');
    RIGHT.dropzoneFile.classList.toggle('hidden');

    RIGHT.formFieldsNoEntries.classList.toggle('active');
    RIGHT.formFieldsNoEntries.classList.toggle('hidden');
    RIGHT.formFieldsContainer.classList.toggle('active');
    RIGHT.formFieldsContainer.classList.toggle('hidden');
  };

  const _initDropzoneRight = (droppedFile) => {
    RIGHT.dropzoneFileName.innerText = droppedFile.name;
    RIGHT.dropZone.style.borderColor = 'blue';
  };

  const _handleDropRight = (ev) => {
    ev.preventDefault();

    UTILS.clearList([
      UTILS.CONSTANTS.RIGHT.formFieldList,
      UTILS.CONSTANTS.RIGHT.rawFieldList,
      UTILS.CONSTANTS.DIFF.container,
    ]);
    RIGHT.formFields = {};
    DIFF.isNew = true;

    const droppedFile = UTILS.getPdfFile(ev);

    _toggleDropzoneRight();
    _initDropzoneRight(droppedFile);

    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      const formFields = await UTILS.getPdfContent(pdf, pdf.numPages);
      RIGHT.formFields = formFields;
      RENDERER.fields(formFields, UTILS.CONSTANTS.RIGHT.formFieldList, RIGHT.simplifiedFormFields);
      RENDERER.raw(formFields, UTILS.CONSTANTS.RIGHT.rawFieldList, RIGHT.rawFormFields);
      RENDERER.viewer(pdf, UTILS.CONSTANTS.RIGHT.viewer);
      document.getElementById('defaultOpenTabFieldsRight').click();
    };

    fileReader.readAsArrayBuffer(droppedFile);
  };

  const _handleDragOverRight = (ev) => {
    ev.preventDefault();
    RIGHT.dropZone.style.borderColor = 'red';
  };

  const _handleDragLeaveRight = (ev) => {
    ev.preventDefault();
    RIGHT.dropZone.style.borderColor = 'blue';
  };

  /**
   * TABS
   */

  const _handleTabSwitchLeftMain = (ev) => {
    for (let i = 0; i < PDF.tabcontent.length; i++) {
      PDF.tabcontent[i].style.display = 'none';
      FIELDS.tabcontent[i].style.display = 'none';
    }

    for (let i = 0; i < PDF.tablinks.length; i++) {
      PDF.tablinks[i].classList.remove('selected');
      FIELDS.tablinks[i].classList.remove('selected');
    }

    const tabNames = ev.currentTarget.dataset.tabs.split(',');
    const tabLinks = ev.currentTarget.dataset.links.split(',');

    for (const index in tabNames) {
      if (Object.hasOwnProperty.call(tabNames, index)) {
        const tabName = tabNames[index];
        document.getElementById(tabName).style.display = 'flex';
        const tabLinkParts = tabLinks[index].split('::');
        const tabLinkId = tabLinkParts[0];
        const tabLinkIndex = tabLinkParts[1];
        document.getElementsByClassName(tabLinkId)[tabLinkIndex].classList.add('selected');
      }
    }
  };

  const _handleTabSwitchRightMain = (ev) => {
    for (let i = 0; i < FIELDS.tabcontent.length; i++) {
      FIELDS.tabcontent[i].style.display = 'none';
      if (i < UTILS.CONSTANTS.DIFF.TAB_ID) {
        PDF.tabcontent[i].style.display = 'none';
      }
    }

    for (let i = 0; i < FIELDS.tablinks.length; i++) {
      FIELDS.tablinks[i].classList.remove('selected');
      if (i < UTILS.CONSTANTS.DIFF.TAB_ID) {
        PDF.tablinks[i].classList.remove('selected');
      }
    }

    const tabNames = ev.currentTarget.dataset.tabs.split(',');
    const tabLinks = ev.currentTarget.dataset.links.split(',');

    for (const index in tabNames) {
      if (Object.hasOwnProperty.call(tabNames, index)) {
        const tabName = tabNames[index];
        document.getElementById(tabName).style.display = 'flex';
        const tabLinkParts = tabLinks[index].split('::');
        const tabLinkId = tabLinkParts[0];
        const tabLinkIndex = tabLinkParts[1];
        document.getElementsByClassName(tabLinkId)[tabLinkIndex].classList.add('selected');
        if (Number(tabLinkIndex) === UTILS.CONSTANTS.DIFF.TAB_ID) {
          _handleDiffing();
        }
      }
    }
  };

  const _handleTabSwitchLeftSub = (ev) => {
    for (let i = 0; i < LEFT.tabcontent.length; i++) {
      LEFT.tabcontent[i].style.display = 'none';
    }

    for (let i = 0; i < LEFT.tablinks.length; i++) {
      LEFT.tablinks[i].classList.remove('selected');
    }

    const tabName = ev.currentTarget.dataset.tab;
    document.getElementById(tabName).style.display = 'flex';
    ev.currentTarget.classList.add('selected');
  };

  const _handleTabSwitchRightSub = (ev) => {
    for (let i = 0; i < RIGHT.tabcontent.length; i++) {
      RIGHT.tabcontent[i].style.display = 'none';
    }

    for (let i = 0; i < RIGHT.tablinks.length; i++) {
      RIGHT.tablinks[i].classList.remove('selected');
    }

    const tabName = ev.currentTarget.dataset.tab;
    document.getElementById(tabName).style.display = 'flex';
    ev.currentTarget.classList.add('selected');
  };

  /**
   * DIFFING
   */

  const _handleDiffing = () => {
    if (!DIFF.isNew) {
      return;
    }

    const left = UTILS.removeRaw(LEFT.formFields);
    const right = UTILS.removeRaw(RIGHT.formFields);

    if (UTILS.isEmpty(left) || UTILS.isEmpty(right)) {
      DIFF.isNew = true;
      return;
    }

    DIFF.isNew = !DIFF.isNew;

    const holder = document.createElement('div');
    holder.id = UTILS.CONSTANTS.DIFF.container;

    const result = Diff.diffJson(left, right);

    result.forEach((part) => {
      const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
      const span = document.createElement('span');
      span.style.color = color;
      span.appendChild(document.createTextNode(part.value));
      holder.appendChild(span);
    });

    DIFF.container.appendChild(holder);
  };

  /**
   * SETUP
   */

  const initHandler = () => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'public/libs/pdfjs/build/pdf.worker.min.js';

    LEFT.dropZone.addEventListener('drop', _handleDropLeft);
    LEFT.dropZone.addEventListener('dragover', _handleDragOverLeft);
    LEFT.dropZone.addEventListener('dragleave', _handleDragLeaveLeft);

    RIGHT.dropZone.addEventListener('drop', _handleDropRight);
    RIGHT.dropZone.addEventListener('dragover', _handleDragOverRight);
    RIGHT.dropZone.addEventListener('dragleave', _handleDragLeaveRight);

    Array.from(PDF.tablinks).forEach((tablink) => tablink.addEventListener('click', _handleTabSwitchLeftMain));
    Array.from(FIELDS.tablinks).forEach((tablink) => tablink.addEventListener('click', _handleTabSwitchRightMain));
    Array.from(LEFT.tablinks).forEach((tablink) => tablink.addEventListener('click', _handleTabSwitchLeftSub));
    Array.from(RIGHT.tablinks).forEach((tablink) => tablink.addEventListener('click', _handleTabSwitchRightSub));

    LEFT.pdfFile.addEventListener('change', _handleDropLeft);
    RIGHT.pdfFile.addEventListener('change', _handleDropRight);
  };

  const removeHandler = () => {
    LEFT.dropZone.removeEventListener('drop', _handleDropLeft);
    LEFT.dropZone.removeEventListener('dragover', _handleDragOverLeft);
    LEFT.dropZone.removeEventListener('dragleave', _handleDragLeaveLeft);

    RIGHT.dropZone.removeEventListener('drop', _handleDropRight);
    RIGHT.dropZone.removeEventListener('dragover', _handleDragOverRight);
    RIGHT.dropZone.removeEventListener('dragleave', _handleDragLeaveRight);

    Array.from(PDF.tablinks).forEach((tablink) => tablink.removeEventListener('click', _handleTabSwitchLeftMain));
    Array.from(FIELDS.tablinks).forEach((tablink) => tablink.removeEventListener('click', _handleTabSwitchRightMain));
    Array.from(LEFT.tablinks).forEach((tablink) => tablink.removeEventListener('click', _handleTabSwitchLeftSub));
    Array.from(RIGHT.tablinks).forEach((tablink) => tablink.removeEventListener('click', _handleTabSwitchRightSub));

    LEFT.pdfFile.removeEventListener('change', _handleDropLeft);
    RIGHT.pdfFile.removeEventListener('change', _handleDropRight);
  };

  initHandler();
  window.addEventListener('beforeunload', removeHandler);
  document.getElementById('defaultOpenTabPdfs').click();
  document.getElementById('defaultOpenTabFields').click();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
})(utils, renderer);
