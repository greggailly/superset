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
import { ColumnMeta, Metric } from '@superset-ui/chart-controls';
import { FoldersEditorItemType } from 'src/components/Datasource/types';
import { DndItemType } from '../DndItemType';

export type DndItemValue = ColumnMeta | Metric;

export interface DatasourcePanelDndItem {
  // an array only for DndItemType.Folder, carrying every column/metric
  // the dragged folder (and its sub-folders) contain
  value: DndItemValue | DndItemValue[];
  type: DndItemType;
}

export function isDatasourcePanelDndItem(
  item: any,
): item is DatasourcePanelDndItem {
  return item?.value && item?.type;
}

// Normalizes a dropped item's value to an array, regardless of whether it's
// a single column/metric drag or a DndItemType.Folder drag of many.
export function getDndItemValues(item: DatasourcePanelDndItem): DndItemValue[] {
  return Array.isArray(item.value) ? item.value : [item.value];
}

export function isSavedMetric(item: any): item is Metric {
  return item?.metric_name;
}

export type DatasourcePanelColumn = {
  uuid: string;
  id?: number;
  is_dttm?: boolean | null;
  description?: string | null;
  expression?: string | null;
  is_certified?: number | null;
  column_name?: string | null;
  name?: string | null;
  type?: string;
};

export type DatasourceFolderItem = {
  type: FoldersEditorItemType.Column | FoldersEditorItemType.Metric;
  uuid: string;
  name: string;
};
export type DatasourceFolder = {
  uuid: string;
  type: FoldersEditorItemType.Folder;
  name: string;
  description?: string;
  children?: (DatasourceFolder | DatasourceFolderItem)[];
};

export type MetricItem = Metric & {
  type: FoldersEditorItemType.Metric;
};

export type ColumnItem = DatasourcePanelColumn & {
  type: FoldersEditorItemType.Column;
};

export type FolderItem = MetricItem | ColumnItem;

export interface Folder {
  id: string;
  name: string;
  description?: string;
  isCollapsed: boolean;
  items: FolderItem[];
  subFolders?: Folder[];
  parentId?: string;
  totalItems: number;
  showingItems: number; // items shown after filtering
}

export interface FlattenedItem {
  type: 'header' | 'item' | 'divider' | 'subtitle';
  folderId: string;
  depth: number;
  item?: FolderItem;
  height: number;
  totalItems?: number;
  showingItems?: number;
}

// Recursively collects every column/metric directly or transitively
// contained in a folder, so an entire folder can be dragged as one item.
export function flattenFolderItems(folder: Folder): FolderItem[] {
  return [
    ...folder.items,
    ...(folder.subFolders?.flatMap(flattenFolderItems) ?? []),
  ];
}
