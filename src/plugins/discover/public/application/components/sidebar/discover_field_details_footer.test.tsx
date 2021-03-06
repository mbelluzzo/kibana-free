/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { findTestSubject } from '@elastic/eui/lib/test';
// @ts-ignore
import stubbedLogstashFields from 'fixtures/logstash_fields';
import { mountWithIntl } from '@kbn/test/jest';
import { coreMock } from '../../../../../../core/public/mocks';
import { IndexPatternField } from '../../../../../data/public';
import { getStubIndexPattern } from '../../../../../data/public/test_utils';
import { DiscoverFieldDetailsFooter } from './discover_field_details_footer';

const indexPattern = getStubIndexPattern(
  'logstash-*',
  (cfg: any) => cfg,
  'time',
  stubbedLogstashFields(),
  coreMock.createSetup()
);

describe('discover sidebar field details footer', function () {
  const onAddFilter = jest.fn();
  const defaultProps = {
    indexPattern,
    details: { buckets: [], error: '', exists: 1, total: 2, columns: [] },
    onAddFilter,
  };

  function mountComponent(field: IndexPatternField) {
    const compProps = { ...defaultProps, field };
    return mountWithIntl(<DiscoverFieldDetailsFooter {...compProps} />);
  }

  it('renders properly', function () {
    const visualizableField = new IndexPatternField({
      name: 'bytes',
      type: 'number',
      esTypes: ['long'],
      count: 10,
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: true,
    });
    const component = mountComponent(visualizableField);
    expect(component).toMatchSnapshot();
  });

  it('click on addFilter calls the function', function () {
    const visualizableField = new IndexPatternField({
      name: 'bytes',
      type: 'number',
      esTypes: ['long'],
      count: 10,
      scripted: false,
      searchable: true,
      aggregatable: true,
      readFromDocValues: true,
    });
    const component = mountComponent(visualizableField);
    const onAddButton = findTestSubject(component, 'onAddFilterButton');
    onAddButton.simulate('click');
    expect(onAddFilter).toHaveBeenCalledWith('_exists_', visualizableField.name, '+');
  });
});
