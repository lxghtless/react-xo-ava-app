import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';

import Home from '../src/Home';

test('home page renders content as expected', t => {
	const wrapper = shallow(<Home/>);

	t.truthy(wrapper.hasClass('page'));
	t.is(wrapper.find('.page').length, 1);
	t.is(wrapper.find('.page').render().text(), 'Home page');
});
