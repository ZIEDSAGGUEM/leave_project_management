import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";
import { Bell, CloudCog } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import axios from 'axios';
import useUserStore from "../store/useUserStore";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useUserStore();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/notifications', {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });
        setNotifications(response.data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Erreur lors du chargement des notifications');
      }
    };

    if (user?.token && !user?.isAdmin) {
      fetchNotifications();
    }
  }, [user?.token, user?.isAdmin, notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: "Tableau de bord", path: "/dashboard", admin: false },
    { name: "Demande de congé", path: "/request-leave", admin: false },
    { name: "Administration", path: "/admin", admin: true },
  ].filter((link) => link.admin === user?.isAdmin);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/api/leaves/notify/${notificationId}`, {}, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      toast.success('Notification marquée comme lue');
    } catch (error) {
      toast.error('Erreur lors du marquage de la notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => markAsRead(n._id))
      );
      toast.success('Toutes les notifications ont été marquées comme lues');
    } catch (error) {
      toast.error('Erreur lors du marquage des notifications');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                LeaveFlow
              </span>
            </Link>

            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    isActive(link.path)
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  } transition-colors px-1 py-2 text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-full after:origin-left after:transition-transform after:duration-300 ${
                    isActive(link.path)
                      ? "after:bg-primary after:scale-x-100"
                      : "after:bg-primary after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {!user?.isAdmin && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative p-1 text-muted-foreground hover:text-foreground transition-colors">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] min-w-[18px] h-[18px] flex items-center justify-center"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-medium">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:underline"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification._id} 
                          className={`p-3 border-b last:border-b-0 ${notification.read ? 'bg-background' : 'bg-muted/30'}`}
                        >
                          <div className="flex justify-between items-start">
                            <p className="text-sm">{notification.message}</p>
                            {!notification.read && (
                              <button 
                                onClick={() => markAsRead(notification._id)}
                                className="text-xs text-primary hover:underline ml-2"
                              >
                                Marquer comme lu
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        Aucune notification
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <div className="relative ml-3">
              <div>
                <button
                  onClick={toggleProfile}
                  className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <span className="mr-2 hidden md:block">{user?.name}</span>
                  <ProfileAvatar name={user?.name} />
                </button>
              </div>

              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 animate-fade-in">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {user?.email}
                    </p>
                    {user?.isAdmin && (
                      <p className="text-xs text-primary mt-1">
                        Administrateur
                      </p>
                    )}
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mon profil
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
