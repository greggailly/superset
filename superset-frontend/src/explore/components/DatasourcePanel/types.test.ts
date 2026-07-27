/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { FoldersEditorItemType } from 'src/components/Datasource/types';
import { DndItemType } from '../DndItemType';
import {
  ColumnItem,
  DndItemValue,
  Folder,
  getDndItemValues,
  flattenFolderItems,
  MetricItem,
} from './types';

const columnItem = (column_name: string): ColumnItem => ({
  uuid: column_name,
  column_name,
  type: FoldersEditorItemType.Column,
});

const metricItem = (metric_name: string): MetricItem => ({
  uuid: metric_name,
  metric_name,
  type: FoldersEditorItemType.Metric,
});

const dndColumn = (column_name: string): DndItemValue => ({ column_name });

const dndMetric = (metric_name: string): DndItemValue => ({
  uuid: metric_name,
  metric_name,
});

test('getDndItemValues wraps a single dragged value in an array', () => {
  const value = dndColumn('state');
  expect(getDndItemValues({ value, type: DndItemType.Column })).toEqual([
    value,
  ]);
});

test('getDndItemValues passes through an already-array folder value', () => {
  const values = [dndColumn('state'), dndMetric('count')];
  expect(getDndItemValues({ value: values, type: DndItemType.Folder })).toBe(
    values,
  );
});

test('flattenFolderItems returns a folder’s own items when it has no sub-folders', () => {
  const folder: Folder = {
    id: '1',
    name: 'Columns',
    isCollapsed: false,
    items: [columnItem('state'), columnItem('city')],
    totalItems: 2,
    showingItems: 2,
  };
  expect(flattenFolderItems(folder)).toEqual([
    columnItem('state'),
    columnItem('city'),
  ]);
});

test('flattenFolderItems recursively collects items from nested sub-folders', () => {
  const grandchild: Folder = {
    id: '3',
    name: 'Nested',
    isCollapsed: false,
    items: [metricItem('count')],
    totalItems: 1,
    showingItems: 1,
  };
  const child: Folder = {
    id: '2',
    name: 'Child',
    isCollapsed: false,
    items: [columnItem('city')],
    subFolders: [grandchild],
    totalItems: 2,
    showingItems: 2,
  };
  const parent: Folder = {
    id: '1',
    name: 'Parent',
    isCollapsed: false,
    items: [columnItem('state')],
    subFolders: [child],
    totalItems: 3,
    showingItems: 3,
  };

  expect(flattenFolderItems(parent)).toEqual([
    columnItem('state'),
    columnItem('city'),
    metricItem('count'),
  ]);
});
