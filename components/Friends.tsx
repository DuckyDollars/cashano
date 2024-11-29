'use client';

const FriendsTab = () => {
  return (
    <div className="friends-tab-con px-4 h-screen transition-all duration-300 bg-gradient-to-b from-green-500 to-teal-500">
      <div className="pt-8 space-y-1">
        <h1 className="text-3xl font-bold">INVITE FRIENDS</h1>
        <div className="text-xl">
          <span className="font-semibold">SHARE</span>
          <span className="ml-2 text-gray-500">YOUR INVITATION</span>
        </div>
        <div className="text-xl">
          <span className="text-gray-500">LINK &</span>
          <span className="ml-2 font-semibold">GET 5%</span>
          <span className="ml-2 text-gray-500">OF</span>
        </div>
        <div className="text-gray-500 text-xl">FRIEND`S COMMUNICATION</div>
      </div>
    </div>
  );
};

export default FriendsTab;
