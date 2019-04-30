const babelRegister = require('@babel/register');
const Enzyme = require('enzyme');
const EnzymeReactAdapter = require('enzyme-adapter-react-16');

babelRegister({
	ignore: ['node_modules/*', 'test/*']
});

Enzyme.configure({
	adapter: new EnzymeReactAdapter()
});
