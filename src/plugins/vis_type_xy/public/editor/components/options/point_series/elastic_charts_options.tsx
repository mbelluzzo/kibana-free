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

import React, { useState, useEffect } from 'react';

import { i18n } from '@kbn/i18n';
import { METRIC_TYPE } from '@kbn/analytics';

import {
  SelectOption,
  SwitchOption,
  PalettePicker,
} from '../../../../../../vis_default_editor/public';
import { PaletteRegistry } from '../../../../../../charts/public';

import { ChartType } from '../../../../../common';
import { VisParams } from '../../../../types';
import { ValidationVisOptionsProps } from '../../common';
import { getPalettesService, getTrackUiMetric } from '../../../../services';

export function ElasticChartsOptions(props: ValidationVisOptionsProps<VisParams>) {
  const trackUiMetric = getTrackUiMetric();
  const [palettesRegistry, setPalettesRegistry] = useState<PaletteRegistry | null>(null);
  const { stateParams, setValue, vis, aggs } = props;

  const hasLineChart = stateParams.seriesParams.some(
    ({ type, data: { id: paramId } }) =>
      (type === ChartType.Line || type === ChartType.Area) &&
      aggs.aggs.find(({ id }) => id === paramId)?.enabled
  );

  useEffect(() => {
    const fetchPalettes = async () => {
      const palettes = await getPalettesService().getPalettes();
      setPalettesRegistry(palettes);
    };
    fetchPalettes();
  }, []);

  return (
    <>
      <SwitchOption
        data-test-subj="detailedTooltip"
        label={i18n.translate('visTypeXy.editors.elasticChartsOptions.detailedTooltip.label', {
          defaultMessage: 'Show detailed tooltip',
        })}
        tooltip={i18n.translate('visTypeXy.editors.elasticChartsOptions.detailedTooltip.tooltip', {
          defaultMessage:
            'Enables the legacy detailed tooltip for displaying a single value. When disabled, a new summarized tooltip will be used to display multiple values.',
        })}
        paramName="detailedTooltip"
        value={stateParams.detailedTooltip}
        setValue={(paramName, value) => {
          if (trackUiMetric) {
            trackUiMetric(METRIC_TYPE.CLICK, 'detailed_tooltip_switched');
          }
          setValue(paramName, value);
        }}
      />

      {hasLineChart && (
        <SelectOption
          data-test-subj="fittingFunction"
          label={i18n.translate('visTypeXy.editors.elasticChartsOptions.missingValuesLabel', {
            defaultMessage: 'Fill missing values',
          })}
          options={vis.type.editorConfig.collections.fittingFunctions}
          paramName="fittingFunction"
          value={stateParams.fittingFunction}
          setValue={(paramName, value) => {
            if (trackUiMetric) {
              trackUiMetric(METRIC_TYPE.CLICK, 'fitting_function_selected');
            }
            setValue(paramName, value);
          }}
        />
      )}

      {palettesRegistry && (
        <PalettePicker
          palettes={palettesRegistry}
          activePalette={stateParams.palette}
          paramName="palette"
          setPalette={(paramName, value) => {
            if (trackUiMetric) {
              trackUiMetric(METRIC_TYPE.CLICK, 'palette_selected');
            }
            setValue(paramName, value);
          }}
        />
      )}
    </>
  );
}
