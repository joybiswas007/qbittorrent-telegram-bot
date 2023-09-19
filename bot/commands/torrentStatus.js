import { client, torrent_size } from "../config.js";
import ms from "ms";

export const status = (bot) => {
  bot.onText(/\/status/, async (msg, match) => {
    const chatID = msg.chat.id;
    const user_hash = msg.text.replace(match[0], "").trim();
    let message = "";
    const options = {
      parse_mode: "HTML",
    };
    try {
      if (user_hash) {
        const torrent_data = await client.getTorrent(user_hash);
        const {
          name,
          id,
          state,
          eta,
          dateAdded,
          dateCompleted,
          isCompleted,
          downloadSpeed,
          uploadSpeed,
          totalDownloaded,
          totalUploaded,
          queuePosition,
          connectedSeeds,
          totalPeers,
        } = torrent_data;
        const { amount_left, num_seeds, num_leechs, total_size, content_path } =
          torrent_data.raw;
        message += "<b>Torrent stats: </b>\n";
        message += `Name: ${name}\n`;
        message += `id: ${id}\n`;
        message += `State: ${state}\n`;
        message += `ETA: ${ms(eta)}\n`;
        message += `Added on: ${dateAdded}\n`;
        message += `Completed on: ${dateCompleted}\n`;
        message += `Completed: ${isCompleted}\n`;
        message += `Download speed: ${torrent_size(downloadSpeed)}\n`;
        message += `Upload speed: ${torrent_size(uploadSpeed)}\n`;
        message += `Downloaded: ${torrent_size(totalDownloaded)}\n`;
        message += `Left amount: ${torrent_size(amount_left)}\n`;
        message += `Uploaded: ${torrent_size(totalUploaded)}\n`;
        message += `Queue position: ${queuePosition}\n`;
        message += `Seeders: ${num_seeds}\n`;
        message += `Leechers: ${num_leechs}\n`;
        message += `Connected seeds: ${connectedSeeds}\n`;
        message += `Total peers: ${totalPeers}\n`;
        message += `Content Path: ${content_path}\n`;
        message += `Size: ${torrent_size(total_size)}\n`;
      } else {
        //if user does't give any id then lists all torrents
        const data = await client.getAllData();
        data.torrents.map((torrent) => {
          const { name, id, isCompleted, state: status, eta } = torrent;
          const { state, total_size, content_path } = torrent.raw;
          message += "<b>Torrents Stats: </b>\n";
          message += `Name: ${name}\n`;
          message += `id: <em>${id}</em>\n`;
          message += `Completed: ${isCompleted}\n`;
          message += `Status: ${status}\n`;
          message += `State: ${state}\n`;
          message += `Content Path: ${content_path}\n`;
          message += `Size: ${torrent_size(total_size)}\n\n`;
        });
      }
      bot.sendMessage(chatID, message || "No jobs in queue!", options);
    } catch (error) {
      bot.sendMessage(chatID, `${error}`);
    }
  });
};