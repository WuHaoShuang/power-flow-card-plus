# Individual 设备数量限制移除

本次修改移除了 Home Assistant Power Flow Card Plus 只能显示4个 individual 设备的限制。

## 修改内容

### 1. 位置计算系统 (`src/utils/computeIndividualPosition.ts`)

- 添加了新的位置计算系统，支持无限数量的 individual 设备
- 保留了原有的4个位置函数以确保向后兼容
- 新增了 `getAllIndividualPositions()` 函数来管理所有设备位置
- 额外的设备将在新行中成对显示（左-右布局）

### 2. 新的渲染组件 (`src/components/individualExtraElement.ts`)

- 创建了专门用于渲染额外 individual 设备的组件
- 支持动态位置和行索引
- 与现有组件保持一致的交互和样式

### 3. 主渲染逻辑修改 (`src/power-flow-card-plus.ts`)

- 修改了主渲染函数以支持额外行
- 使用新的位置计算系统
- 额外设备在底部显示为新的行

### 4. 样式系统扩展 (`src/style/all.ts` & `src/style.ts`)

- 扩展了动态样式生成，支持无限数量的设备
- 为额外位置提供了更多颜色选项
- 添加了额外行的CSS样式

## 使用方法

现在你可以在配置中添加任意数量的 individual 设备：

```yaml
type: custom:power-flow-card-plus
entities:
  individual:
    - entity: sensor.device1_power
      name: "设备 1"
      icon: mdi:car-electric
    - entity: sensor.device2_power  
      name: "设备 2"
      icon: mdi:heat-pump
    - entity: sensor.device3_power
      name: "设备 3" 
      icon: mdi:washing-machine
    - entity: sensor.device4_power
      name: "设备 4"
      icon: mdi:air-conditioner
    - entity: sensor.device5_power
      name: "设备 5"
      icon: mdi:water-heater
    - entity: sensor.device6_power
      name: "设备 6"
      icon: mdi:dishwasher
    # 可以继续添加更多设备...
```

## 布局说明

- **前4个设备**：继续使用原有的4个角落位置（左上、左下、右上、右下）
- **第5-6个设备**：显示在第一个额外行（左、右）
- **第7-8个设备**：显示在第二个额外行（左、右）
- **以此类推**：每增加2个设备添加一个新行

## 颜色配置

额外的设备会自动分配颜色，你也可以手动指定：

```yaml
individual:
  - entity: sensor.device5_power
    name: "设备 5"
    color: "#ff6b6b"  # 自定义颜色
    color_icon: true
    color_value: true
```

## 技术细节

- 只有 `has: true` 的设备才会被显示
- 设备按配置顺序排列
- 支持所有现有的 individual 设备配置选项
- 与 `sort_individual_devices` 配置兼容

## 向后兼容性

所有现有配置将继续正常工作，没有破坏性更改。只是现在可以添加更多设备了。
