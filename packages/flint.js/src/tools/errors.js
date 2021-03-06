let browser = window;

const browserData = data => {
  browser.data = data;
}

// this is for using in runview
const flintRuntimeError = window.flintRuntimeError =
  (message, file, line, col, error) => {
    browserData({ message, file, line, col, stack: error.stack });
    browser.emitter.emit('runtime:error')
  }

export default function run(b, opts) {
  browser = b;

  // catch all errors
  window.onerror = (...args) => {
    flintRuntimeError(...args);
    return false;
  }

  window.onViewLoaded = () =>
    browserData('success', null);
}

export function compileError(error) {
  if (error.loc) {
    const { message, fileName, loc, stack } = error;
    browserData({ message, stack, file: fileName, line: loc.line, col: loc.column });
  }
  else if (error.lineNumber) {
    const { message, stack, fileName, lineNumber, column } = error;
    browserData({ message, stack, file: fileName, line: lineNumber, col: column });
  }
}

export function compileSuccess() {
  browserData(null);
}
