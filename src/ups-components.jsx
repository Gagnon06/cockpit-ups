import React from 'react';
import { Grid, GridItem, Bullseye, Card, CardTitle, CardBody, DataList, DataListItem, DataListItemRow, DataListItemCells, DataListCell } from '@patternfly/react-core';
import { ChartDonutUtilization } from '@patternfly/react-charts';
import { TableComposable, Thead, Tr, Th, Tbody, } from '@patternfly/react-table';

function UpsInfo(props) {
    const upsVariables = props.upsVariables;
    return (
        <DataList isCompact>
            <DataListItem>
                <DataListItemRow>
                    <DataListItemCells dataListCells={[
                        <DataListCell key="manuf_tag">Manufacturer</DataListCell>,
                        <DataListCell key="manuf">{upsVariables.device.mfr}</DataListCell>
                    ]}
                    />
                </DataListItemRow>
            </DataListItem>
            <DataListItem>
                <DataListItemRow>
                    <DataListItemCells dataListCells={[
                        <DataListCell key="model_tag">Model</DataListCell>,
                        <DataListCell key="model">{upsVariables.device.model}</DataListCell>
                    ]}
                    />
                </DataListItemRow>
            </DataListItem>
            <DataListItem>
                <DataListItemRow>
                    <DataListItemCells dataListCells={[
                        <DataListCell key="fw_tag">Firmware</DataListCell>,
                        <DataListCell key="fw">{upsVariables.ups.firmware}</DataListCell>
                    ]}
                    />
                </DataListItemRow>
            </DataListItem>
            <DataListItem>
                <DataListItemRow>
                    <DataListItemCells dataListCells={[
                        <DataListCell key="temp_tag">Temperature</DataListCell>,
                        <DataListCell key="temp">{upsVariables.ups.temperature} °C</DataListCell>
                    ]}
                    />
                </DataListItemRow>
            </DataListItem>
        </DataList>
    );
}

function UpsDetailsTable(props) {
    const data = props.data;
    const headTh = [<Th key="data" />];
    const voltageTh = [<Th key="voltage">Voltage</Th>];
    const currentTh = [<Th key="current">Current</Th>];
    const activePowerTh = [<Th key="activePower">Active Power</Th>];
    const apparentPowerTh = [<Th key="apparentPower">Apparent Power</Th>];

    data.forEach((datum) => {
        headTh.push(<Th>{datum.name}</Th>);
        voltageTh.push(<Th>{datum.voltage || "-"} V</Th>);
        currentTh.push(<Th>{datum.current || "-"} A</Th>);
        activePowerTh.push(<Th>{datum.activePower || "-"} W</Th>);
        apparentPowerTh.push(<Th>{datum.apparentPower || "-"} VA</Th>);
    });

    return (
        <TableComposable
            aria-label="Simple table"
            variant="compact"
        >
            <Thead>
                <Tr>{headTh}</Tr>
            </Thead>
            <Tbody>
                <Tr>{voltageTh}</Tr>
                <Tr>{currentTh}</Tr>
                <Tr>{activePowerTh}</Tr>
                <Tr>{apparentPowerTh}</Tr>
            </Tbody>
        </TableComposable>
    );
}

function UpsSoc(props) {
    const soc = props.soc || 0;
    const maxCapacity = props.maxCapacity || 0;
    let subTitle = "";
    if (maxCapacity !== 0) {
        subTitle = `of ${maxCapacity} Wh`;
    }

    return (
        <Bullseye>
            <div style={{ height: '180px', width: '180px' }}>
                <ChartDonutUtilization
                    ariaDesc="Battery SoC"
                    ariaTitle="Battery SoC"
                    constrainToVisibleArea
                    data={{ x: 'SoC', y: soc }}
                    labels={({ datum }) => datum.x ? `${datum.x}: ${datum.y}%` : null}
                    subTitle={subTitle}
                    title={`${soc}%`}
                />
            </div>
        </Bullseye>
    );
}

function UpsPage(props) {
    const ups = props.ups;
    return (
        <Grid hasGutter>
            <GridItem span={12}>
                <Card>
                    <CardTitle className="upsName">{ups.name} - {ups.description}</CardTitle>
                </Card>
            </GridItem>
            <GridItem span={6} xl={3}>
                <Card>
                    <CardTitle>UPS summary</CardTitle>
                    <CardBody>
                        <UpsInfo upsVariables={ups.variables} />
                    </CardBody>
                </Card>
            </GridItem>
            <GridItem span={6} xl={3}>
                <Card>
                    <CardTitle>SoC</CardTitle>
                    <CardBody>
                        <UpsSoc soc={66} maxCapacity={1100} />
                    </CardBody>
                </Card>
            </GridItem>
            <GridItem span={12} xl={6}>
                <Card>
                    <CardTitle>UPS details</CardTitle>
                    <CardBody>
                        <UpsDetailsTable
                            data={[
                                {
                                    name: "Input",
                                    voltage: undefined,
                                    current: undefined,
                                    activePower: undefined,
                                    apparentPower: undefined
                                },
                                {
                                    name: "Output",
                                    voltage: ups.variables.outlet.voltage,
                                    current: ups.variables.outlet.current,
                                    activePower: ups.variables.outlet.realpower,
                                    apparentPower: ups.variables.outlet.power
                                }
                            ]}
                        />
                    </CardBody>
                </Card>
            </GridItem>
        </Grid>
    );
}

export default UpsPage;
