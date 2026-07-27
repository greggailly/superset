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
import { useDragLayer } from 'react-dnd';
import { t, tn } from '@apache-superset/core/translation';
import { css, useTheme } from '@apache-superset/core/theme';
import { DndItemType } from '../DndItemType';
import { DndItemValue } from './types';

const FolderDragPreview = () => {
  const theme = useTheme();
  const { isDragging, itemType, item, currentOffset } = useDragLayer(
    monitor => ({
      isDragging: monitor.isDragging(),
      itemType: monitor.getItemType(),
      item: monitor.getItem() as { value: DndItemValue | DndItemValue[] },
      currentOffset: monitor.getClientOffset(),
    }),
  );

  if (
    !isDragging ||
    itemType !== DndItemType.Folder ||
    !currentOffset ||
    !Array.isArray(item?.value)
  ) {
    return null;
  }

  const count = item.value.length;

  return (
    <div
      css={css`
        position: fixed;
        top: 0;
        left: 0;
        z-index: ${theme.zIndexPopupBase};
        pointer-events: none;
        transform: translate(
          ${currentOffset.x + theme.sizeUnit * 3}px,
          ${currentOffset.y + theme.sizeUnit * 3}px
        );
        background: ${theme.colorPrimary};
        color: ${theme.colorWhite};
        font-size: ${theme.fontSizeSM}px;
        font-weight: ${theme.fontWeightStrong};
        line-height: 1;
        padding: ${theme.sizeUnit}px ${theme.sizeUnit * 2}px;
        border-radius: ${theme.borderRadiusLG}px;
        box-shadow: ${theme.boxShadow};
        white-space: nowrap;
      `}
      title={t('%s columns', count)}
    >
      {tn('%s column', '%s columns', count, count)}
    </div>
  );
};

export default FolderDragPreview;
