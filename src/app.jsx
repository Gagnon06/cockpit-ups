/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import { Tabs, Tab, TabTitleText, Bullseye, Spinner } from '@patternfly/react-core';
import UpsPage from './ups-components';
import Nut from './nut';

function UpsTabs(props) {
    const upsList = props.upsList;
    const listItems = upsList.map((ups, idx) =>
        <Tab key={ups.name} eventKey={idx} title={<TabTitleText>{ups.name}</TabTitleText>}>
            <UpsPage ups={ups} />
        </Tab>
    );
    return (
        <Tabs defaultActiveKey={0} isBox>{listItems}</Tabs>
    );
}

export class Application extends React.Component {
    constructor() {
        super();
        this.state = {
            allUps: []
        };

        const nut = new Nut();

        nut.getAllUps()
                .then(allUps => {
                    this.setState({ allUps: allUps });
                    console.log(this.state.allUps);
                })
                .catch(() => {
                    console.error("Unable to get UPS list");
                });
    }

    render() {
        if (this.state.allUps.length === 0) {
            return (
                <Bullseye>
                    <Spinner isSVG size="xl" />
                </Bullseye>
            );
        } else {
            return (
                <UpsTabs upsList={this.state.allUps} />
            );
        }
    }
}
