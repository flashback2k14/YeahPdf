const utils = (() => {
  const _CONSTANTS = {
    LEFT: {
      formFieldList: 'formFieldListLeftPdf',
      rawFieldList: 'rawFieldListLeftPdf',
    },
    RIGHT: {
      formFieldList: 'formFieldListRightPdf',
      rawFieldList: 'rawFieldListRightPdf',
    },
  };

  const _extractValue = (annotation) => {
    const fieldType = annotation.fieldType;
    const fieldValue = annotation.fieldValue;
    const buttonValue = annotation.buttonValue;

    let result = '-';

    if (fieldType === 'Tx') {
      result = fieldValue === undefined || fieldValue.length === 0 ? '-' : fieldValue;
    } else if (fieldType === 'Btn') {
      if (buttonValue === undefined) {
        result = fieldValue === undefined || fieldValue.length === 0 ? '-' : fieldValue;
      } else if (buttonValue.length === 0) {
        result = '-';
      } else {
        result = buttonValue;
      }
    }

    return result;
  };

  const _getPdfFile = (ev) => {
    return 'dataTransfer' in ev
      ? ev.dataTransfer.items && ev.dataTransfer.items[0].kind === 'file'
        ? ev.dataTransfer.items[0].getAsFile()
        : ev.dataTransfer.files[0]
      : ev.target.files[0];
  };

  const _getPdfContent = async (pdfInstance, totalPagesCount) => {
    let formFields = {};

    for (let index = 1; index <= totalPagesCount; index++) {
      const page = await pdfInstance.getPage(index);
      const annotations = await page.getAnnotations();
      const fields = annotations.map((annotation) => {
        return {
          name: annotation.fieldName,
          type: annotation.fieldType,
          value: _extractValue(annotation),
        };
      });

      formFields[index] = {
        page: index,
        fields,
        raw: annotations,
      };
    }

    return formFields;
  };

  const _clearList = () => {
    const idsForClearing = [
      _CONSTANTS.LEFT.formFieldList,
      _CONSTANTS.LEFT.rawFieldList,
      _CONSTANTS.RIGHT.formFieldList,
      _CONSTANTS.RIGHT.rawFieldList,
    ];

    for (const id of idsForClearing) {
      const list = document.getElementById(id);
      if (list) {
        list.parentNode.removeChild(list);
      }
    }
  };

  return {
    CONSTANTS: _CONSTANTS,
    getPdfFile: _getPdfFile,
    getPdfContent: _getPdfContent,
    clearList: _clearList,
  };
})();
