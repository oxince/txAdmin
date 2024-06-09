const modulename = 'SocketRoom:Status';
import TxAdmin from "@core/txAdmin";
import { RoomType } from "../webSocket";
import consoleFactory from '@extras/console';
import { DashboardDataEventType } from "@shared/socketioTypes";
const console = consoleFactory(modulename);


/**
 * Returns the dashboard stats data
 */
const getInitialData = (txAdmin: TxAdmin): DashboardDataEventType => {
    const svRuntimeStats = txAdmin.statsManager.svRuntime.getRecentStats();

    return {
        // joinLeaveTally30m: txAdmin.playerlistManager.joinLeaveTally,
        fxsMemory: svRuntimeStats.fxsMemory,
        nodeMemory: svRuntimeStats.nodeMemory,
        perfBoundaries: svRuntimeStats.perfBoundaries,
        perfBucketCounts: svRuntimeStats.perfBucketCounts,
        playerDropReasons: txAdmin.statsManager.playerDrop.getRecentStats(6),

        //NOTE: numbers from fivem/code/components/citizen-server-impl/src/GameServer.cpp
        perfMinTickTime: {
            svMain: 1000 / 20,
            svNetwork: 1000 / 100,
            svSync: 1000 / 120,
        },
    }
}


/**
 * The room for the dashboard page.
 * It relays server performance stuff and drop reason categories.
 * 
 * NOTE: 
 * - active push event for only from StatsManager.svRuntime
 * - StatsManager.playerDrop does not push events, those are sent alongside the playerlist drop event
 *   which also means that if accessing from NUI (ie not joining playerlist room), the chart will only
 *   be updated when the user refreshes the page.
 */
export default (txAdmin: TxAdmin): RoomType => ({
    permission: true, //everyone can see it
    eventName: 'dashboard',
    cumulativeBuffer: false,
    outBuffer: null,
    initialData: () => {
        return getInitialData(txAdmin);
    },
})